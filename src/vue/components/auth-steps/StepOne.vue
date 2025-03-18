<script setup lang="ts">
import { computed } from 'vue'
import { form, error, localization, step, totalCountries, submitStepOne, buttonLoading } from '@/ts/form'
import Select from '../UI/Select.vue'
import Input from '../UI/Input.vue'
import Button from '../UI/Button.vue'
import Triangle from '../svg/Triangle.vue'

const phoneCode = computed(() => {
    return form.stepOne.country.value
        ? totalCountries.value.find(el => el.name === form.stepOne.country.value)?.dial_code
        : '+7'
})
</script>

<template>
    <div class="flex flex-col items-center h-full w-full">
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
            :placeholder="localization === 'ru' ? 'Страна' : 'Country'"
            :options="form.stepOne.country.options"
            :error="error.country"
            v-model="form.stepOne.country.value"
            name="country"
            class="mb-10"
            search
        />

        <Input
            v-model="form.stepOne.phone"
            :placeholder="localization === 'ru' ? 'Номер телефона' : 'Phone number'"
            :error="error.phone"
            :phone-code="phoneCode"
            format="phone"
            class="mb-10"
        />

        <Button @click="submitStepOne" :loading="buttonLoading">
            {{ localization === 'ru' ? 'Продолжить' : 'Continue' }}
        </Button>

        <div class="mt-auto flex items-center justify-between w-full">
            <div
                class="text-xs leading-6 text-arcane-gray-40 flex gap-2 cursor-pointer"
                @click="localization === 'ru' ? localization = 'en' : localization = 'ru'"
            >
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