<script setup lang="ts">
import Loader from '../svg/Loader.vue';

type ButtonProps = {
    theme?: 'blue' | 'white',
    loading?: boolean,
    type?: 'link' | 'btn',
    href?: string,
}

const props = withDefaults(defineProps<ButtonProps>(), {
    theme: 'blue',
    type: 'btn'
})
</script>

<template>
    <component
        :is="props.type === 'link' ? 'a' : 'button'"
        :href="props.href"
        class="text-base flex items-center justify-center h-[55px] w-full px-4 rounded-sm cursor-pointer relative"
        :class="[
            props.theme === 'blue' ? 'text-white bg-arcane-blue' : 'bg-white text-arcane-blue',
            props.loading ? 'bg-white pointer-events-none text-white' : ''
        ]"
    >
        <slot></slot>
        <Loader v-if="props.loading" class="text-arcane-blue absolute top-[50%] left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2" />
    </component>
</template>