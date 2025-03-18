<script setup lang="ts">
import { 
    form,
    step,
    localization,
    clientChannels,
    send,
    error,
    submitStepTwo,
    tgBotPopupVisible,
    popupMessage,
    popupStatusLoading,
    checkBotStatus
} from '@/ts/form'

import Select from '../UI/Select.vue'
import Input from '../UI/Input.vue'
import Button from '../UI/Button.vue'
import Arrow from '../svg/Arrow.vue'
import Triangle from '../svg/Triangle.vue'

</script>

<template>
    <div v-if="tgBotPopupVisible" class="flex flex-col items-center h-full w-full">
        <Arrow class="w-6 h-6 absolute top-4 left-4 text-arcane-gray-50 cursor-pointer" @click="tgBotPopupVisible = false" />
        <img :src="clientChannels.find(el => el.name === form.stepTwo.type.value)?.image_url" class="mb-[30px]">
        <p class="text-[32px] leading-[100%] mb-[30px]">
            {{ clientChannels.find(el => el.name === form.stepTwo.type.value)?.name }}
        </p>
        <p class="text-base leading-[18px] mb-[70px] text-center" :class="popupMessage.type === 'error' ? 'text-arcane-red' : 'text-arcane-gray-70'">
            {{ popupMessage.value }}
        </p>
        <Button type="link" :href="clientChannels.find(el => el.name === form.stepTwo.type.value)?.link" class="mb-2.5">
            Авторизоваться в боте
        </Button>
        <Button theme="white" :loading="popupStatusLoading" @click="checkBotStatus">
            Проверить статус
        </Button>
    </div>
    <div v-else class="flex flex-col items-center h-full w-full">
        <div class="w-[300px] max-w-[300px] h-10 bg-arcane-gray-20 text-arcane-gray-30 text-sm leading-[100%] flex items-center justify-center mb-[30px]">
            {{ localization === 'ru' ? 'Логотип (Высота 40px, длина до 300px)' : 'Logo (Height 40px, Max width 300px)' }}
        </div>
        <p class="text-[32px] leading-[100%] font-bold !mb-[14px] text-center">
            {{ localization === 'ru' ? 'Введите номер телефона' : 'Enter your phone number' }}
        </p>
        <p class="text-base leading-[100%] text-arcane-gray-40 !mb-[30px] text-center">
            {{ localization === 'ru' ? 'Чтобы войти или зарегистрироваться' : 'to sign in or sign up' }}
        </p>

        <Select
            :placeholder="localization === 'ru' ? 'Способ получения кода' : 'Type of getting the code'"
            name="country"
            :options="form.stepTwo.type.options"
            :error="error.type"
            v-model="form.stepTwo.type.value"
            class="mb-10"
        />

        <Input
            v-model="form.stepTwo.code"
            :placeholder="localization === 'ru' ? 'Введите код' : 'Enter the code'"
            format="code"
            class="mb-10"
            :error="error.code"
            :suffix="!!form.stepTwo.type.value"
        >
            <div v-if="form.stepTwo.type.value">
                <div v-if="clientChannels.find(el => el.name === form.stepTwo.type.value)!.timeout > 0" class="text-sm leading-6 text-arcane-gray-50">
                    {{ 
                        `${
                            Math.floor(clientChannels.find(el => el.name === form.stepTwo.type.value)!.timeout / 60)
                        }:${
                            clientChannels.find(el => el.name === form.stepTwo.type.value)!.timeout % 60 === 0 
                                ? '00' 
                                : clientChannels.find(el => el.name === form.stepTwo.type.value)!.timeout % 60 < 10 
                                    ? `0${clientChannels.find(el => el.name === form.stepTwo.type.value)!.timeout % 60}` 
                                    : `${clientChannels.find(el => el.name === form.stepTwo.type.value)!.timeout % 60}`}` 
                    }}
                </div>
                <p v-else class="text-arcane-blue text-sm leading-6 cursor-pointer" @click="send">
                    Отправить
                </p>
            </div>
        </Input>

        <div class="grid grid-cols-2 gap-2.5 w-full">
            <Button theme="white" @click="step = 1">
                <Arrow class="mr-2.5 text-arcane-blue w-4" />
                {{ localization === 'ru' ? 'Назад' : 'Back' }}
            </Button>
            <Button @click="submitStepTwo">
                {{ localization === 'ru' ? 'Продолжить' : 'Continue' }}
            </Button>
        </div>

        <div class="mt-auto flex items-center justify-between w-full">
            <div class="text-xs leading-6 text-arcane-gray-40 flex gap-2 cursor-pointer" @click="localization === 'ru' ? localization = 'en' : localization = 'ru'">
                <p>{{ localization === 'ru' ? 'Русский' : 'English' }}</p>
                <Triangle />
            </div>

            <div class="flex items-center gap-6">
                <p class="text-xs leading-6 text-arcane-gray-40">
                    {{ localization === 'ru' ? 'Условия' : 'Conditions' }}
                </p>
                <p class="text-xs leading-6 text-arcane-gray-40">
                    {{ localization === 'ru' ? 'Конфиденциальность' : 'Confidential' }}
                </p>
            </div>
        </div>
    </div>
</template>