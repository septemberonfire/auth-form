<script setup lang="ts">
import StepOne from './vue/components/auth-steps/StepOne.vue'
import StepTwo from './vue/components/auth-steps/StepTwo.vue'

import { step, getSelectOptions } from './ts/form'
import { onMounted } from 'vue'

onMounted(() => {
  getSelectOptions()
})
</script>

<template>
  <main class="grid items-center justify-center h-screen">
    <div class="border border-arcane-gray-10 p-[50px_32px_24px_32px] rounded-lg w-[500px] h-[594px] flex flex-col items-center relative">
      <StepOne v-show="step === 1" />
      <StepTwo v-show="step === 2" />
    </div>
  </main>
</template>