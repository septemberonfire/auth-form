<script setup lang="ts">
import Inputmask from "inputmask"
import { ref, onMounted, watch } from "vue"

type Input = {
    name?: string,
    placeholder?: string,
    disabled?: boolean
    error?: string | null,
    format?: 'phone' | 'code',
    type?: string,
    phoneCode?: string
    suffix?: boolean,
}

const props = defineProps<Input>();

const input = ref<HTMLInputElement | null>(null)
const model = defineModel<string | number | null>()
const focus = ref<boolean>(false)

const countryCodePhone = ref<string>('+7')

onMounted(() => {
    if (props.format) {
        if (props.format === 'phone') {
            Inputmask({ mask: `${countryCodePhone.value} ### ###-##-##` }).mask(input.value!)
        } else if (props.format === 'code') {
            Inputmask({ mask: '####' }).mask(input.value!)
        }
    }
})

watch(
    () => props.phoneCode, (newValue) => {
        if (newValue) {
            countryCodePhone.value = newValue
            model.value = null
        } else {
            countryCodePhone.value = '+7'
            model.value = null
        }
        Inputmask({ mask: `${countryCodePhone.value} ### ###-##-##` }).mask(input.value!)
    }, { deep: true }
)
</script>

<template>
    <div class="flex flex-col w-full">
        <div class="relative">
            <div
                class="rounded-sm h-[55px] border w-full p-4"
                :class="props.error ? 'border-arcane-red' : 'border-arcane-gray-10'"
            >
                <p
                    class="text-arcane-gray-50 bg-white transition-all duration-200 ease-in-out !m-0 w-fit"
                    :class="model || focus ? 'text-xs leading-4 -translate-y-6 px-1' : 'text-base leading-6'"
                >
                    {{ props.placeholder }}
                </p>
                <input
                    ref="input"
                    v-model="model"
                    :name="props.name"
                    :type="props.type || 'text'"
                    :disabled="props.disabled"
                    :placeholder="props.placeholder"
                    class="bg-transparent outline-none absolute left-4 top-[50%] -translate-y-1/2 placeholder:opacity-0 transition-all duration-200 ease-in-out"
                    :class="focus || model ? 'opacity-100' : 'opacity-0'"
                    @focus="focus = true"
                    @blur="focus = false"
                >
                <div v-if="props.suffix" class="absolute right-4 top-[50%] -translate-y-1/2">
                    <slot></slot>
                </div>
            </div>
        </div>
        <Transition mode="out-in">
            <span v-if="props.error" class="text-arcane-red text-xs leading-4 pt-1 pl-4">
                {{ props.error }}
            </span>
        </Transition>
    </div>
</template>