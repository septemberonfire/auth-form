import { reactive, ref, watch } from "vue"
import axios from "axios"

import type { Country, Form, Error, CreateResponse, SendResponse, SendResponseError, CheckResponseError, CheckResponse } from "./types"

import { flagRender } from "./utils/flagRender"

export const totalCountries = ref<Country[]>([])
export const step = ref(1)
export const localization = ref('ru')
export const buttonLoading = ref<boolean>(false)
export const tgBotPopupVisible = ref<boolean>(false)
export const popupMessage = reactive({
    value: '',
    type: 'default'
})

export const popupStatusLoading = ref<boolean>(false)

const apiKey = '09459085-5327-4ae9-85a8-214b7755fc2a'
const session_id = ref<string>('')
export const clientChannels = ref<CreateResponse['client_channels']>([])

export const form: Form = reactive({
    stepOne: {
        country: {
            options: [],
            value: null
        },
        phone: null,
    },
    stepTwo: {
        type: {
            options: [],
            value: null,
        },
        code: null,
    }
})

export const error: Error = reactive({
    country: null,
    phone: null,
    type: null,
    code: null,
})

popupMessage.value = localization.value === 'ru' ? 'Для использования данного канала связи вам необходимо авторизоваться в боте' : 'To use this communication channel, you need to sign in to the bot.'

export async function getSelectOptions() {
    const request = await axios.get('https://gist.githubusercontent.com/DmytroLisitsyn/1c31186e5b66f1d6c52da6b5c70b12ad/raw/2bc71083a77106afec2ec37cf49d05ee54be1a22/country_dial_info.json')
    if (request && request.status === 200) {
        totalCountries.value = request.data
        totalCountries.value.forEach((c) => {
            const formattedOption = {
                id: c.code,
                name: c.name,
                html: `<div class="flex items-center">
                    <p class="text-base leading-[120%] text-black !m-0 ml-2.5 flex-grow">${c.name}</p>
                    <p class="text-base leading-[120%] font-bold !m-0">${c.dial_code}</p>
                </div>`
            }
            form.stepOne.country.options.push(formattedOption)
        })
    }
}

function validateStepOne() {
    let result: boolean = true
    for (let key in form.stepOne) {
        if (key === 'country') {
            if (!form.stepOne[key].value) {
                error[key] = localization.value === 'ru' ? 'Обязательное поле' : 'Required field'
                result = false
            }
        } else if (key === 'phone') {
            if (!form.stepOne[key]) {
                error[key] = localization.value === 'ru' ? 'Обязательное поле' : 'Required field'
                result = false
            } else if (form.stepOne[key].replace(/[^0-9]/g, '').length < 11) {
                error[key] = localization.value === 'ru' ? 'Неверный формат номера' : 'Incorrect format of number'
                result = false
            }
        }
    }
    return result
}

function validateStepTwo() {
    let result: boolean = true
    for (let key in form.stepTwo) {
        if (key === 'type') {
            if (!form.stepTwo[key].value) {
                error[key] = localization.value === 'ru' ? 'Обязательное поле' : 'Required field'
                result = false
            }
        } else if (key === 'code') {
            if (!form.stepTwo[key]) {
                error[key] = localization.value === 'ru' ? 'Обязательное поле' : 'Required field'
                result = false
            } else if (form.stepTwo[key].replace(/[^0-9]/g, '').length < 4) {
                error[key] = localization.value === 'ru' ? 'Неверный формат кода' : 'Incorrect format of code'
                result = false
            }
        }
    }
    return result
}

export async function submitStepOne() {
    const validate = validateStepOne()
    if (validate) {
        buttonLoading.value = true
        const createRequest = await axios.get('https://api.kod.mobi/api/v1/message/create', {
            params: {
                phone: form.stepOne.phone!.replace(/[^0-9]/g, ''),
                lang: localization.value
            },
            headers: {
                'x-api-key': apiKey
            }
        })

        if (createRequest && createRequest.status === 200) {
            const { data }: {data: CreateResponse} = createRequest.data
            
            session_id.value = data.session_id
            clientChannels.value = data.client_channels
            clientChannels.value.forEach((channel) => {
                const ch = {
                    id: channel.name,
                    name: channel.name,
                    html: `<div class="flex items-center gap-2.5">
                        <img src="${channel.image_url}" class="w-6 h-6">
                        <p>${channel.name}</p>
                    </div>`,
                    type: channel.type,
                    is_active: channel.is_active,
                    link: channel.link,
                    description: channel.description,
                    timeout: channel.timeout
                }
                form.stepTwo.type.options.push(ch)
            })
            buttonLoading.value = false
            step.value = 2
            form.stepTwo.type.value = clientChannels.value.find(c => c.is_active === true)!.name
            setCountdown(form.stepTwo.type.value)
        }
    }
}

export async function send() {
    try {
        const sendRequest = await axios.get('https://api.kod.mobi/api/v1/message/send', {
            params: {
                session_id: session_id.value,
                type: form.stepTwo.type.options.find(el => el.name === form.stepTwo.type.value)!.type,
                lang: localization.value
            },
            headers: {
                'x-api-key': apiKey
            }
        })
    
        if (sendRequest && sendRequest.status === 200) {
            const { data }: {data: SendResponse} = sendRequest.data
            const idx = clientChannels.value.findIndex(el => el.name === form.stepTwo.type.value)
            
            clientChannels.value[idx].timeout = data.client_channel.timeout
            clientChannels.value[idx].is_active = data.client_channel.is_active
            setCountdown(clientChannels.value[idx].name)
        }
    } catch(err) {
        error.type = (err as SendResponseError).response.data.error
    }
}

function setCountdown(key: string) {
    const idx = clientChannels.value.findIndex(el => el.name === key)
    const timer = setInterval(() => {
        if (clientChannels.value[idx].timeout > 0) {
            clientChannels.value[idx].timeout = clientChannels.value[idx].timeout - 1
        } else {
            clearInterval(timer);
        }
    }, 1000);
}

export async function submitStepTwo() {
    const validate = validateStepTwo()
    if (validate) {
        try {
            const checkRequest = await axios.get('https://api.kod.mobi/api/v1/message/check', {
                params: {
                    code: Number(form.stepTwo.code),
                    session_id: session_id.value,
                    lang: localization.value
                },
                headers: {
                    'x-api-key': apiKey
                }
            })

            if (checkRequest && checkRequest.status === 200) {
                const { data }: {data: CheckResponse} = checkRequest.data
                console.log(data.verify_token);
            }
        } catch(err) {
            error.code = (err as CheckResponseError).response.data.error
        }
    }
}

export async function checkBotStatus() {
    popupStatusLoading.value = true

    try {
        const sendRequest = await axios.get('https://api.kod.mobi/api/v1/message/send', {
            params: {
                session_id: session_id.value,
                type: form.stepTwo.type.options.find(el => el.name === form.stepTwo.type.value)!.type,
                lang: localization.value
            },
            headers: {
                'x-api-key': apiKey
            }
        })
    
        if (sendRequest && sendRequest.status === 200) {
            const { data }: {data: SendResponse} = sendRequest.data
            const idx = clientChannels.value.findIndex(el => el.name === form.stepTwo.type.value)
            
            clientChannels.value[idx].timeout = data.client_channel.timeout
            clientChannels.value[idx].is_active = data.client_channel.is_active
            setCountdown(clientChannels.value[idx].name)
            tgBotPopupVisible.value = false
        }
    } catch(err) {
        error.type = (err as SendResponseError).response.data.error
        popupMessage.type = 'error'
        popupMessage.value = localization.value === 'ru' ? 'Вы все еще не авторизованы в боте, пожалуйста, повторите попытку' : 'You are still not logged into the bot, please try again'
    }
    finally {
        popupStatusLoading.value = false
    }
}

watch(
    () => form, () => {
        error.country = null
        error.phone = null
        error.type = null
        error.code = null
    }, { deep: true }
)

watch(
    () => form.stepTwo.type.value, (newValue) => {
        if (newValue === 'Telegram') {
            tgBotPopupVisible.value = true
        }
    }, { deep: true }
)