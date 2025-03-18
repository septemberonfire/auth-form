<script setup lang="ts">
import { ref, watch } from 'vue'
import Chevron from '../svg/Chevron.vue'
import Search from '../svg/Search.vue'
import Close from '../svg/Close.vue'

type SelectProps = {
    placeholder: string,
    name: string,
    options: {
        id: string,
        name: string,
        html: string,
    } [],
    error: string | null,
    search?: boolean,
}

const props = defineProps<SelectProps>()

const filteredOptions = ref<SelectProps['options']>(props.options)

const open = ref<boolean>(false)
const model = defineModel<string | null>()

const searchInput = ref<string>('')

function onOptionClick(name: string) {
    if (model.value === name) {
        model.value = null
        open.value = false
    } else {
        model.value = name
        open.value = false
    }
}

watch(
    () => searchInput.value, (newValue) => {
        if (!newValue) {
            filteredOptions.value = props.options
        } else {
            filteredOptions.value = props.options.filter(el => el.name.toLowerCase().includes(newValue.toLowerCase()))
        }
    }
)

watch(
    () => open.value, (newValue) => {
        searchInput.value = ''
    }
)
</script>

<template>
    <div class="flex flex-col w-full z-[1] relative">
        <div
            class="rounded-sm h-[55px] cursor-pointer border w-full p-4"
            :class="props.error ? 'border-arcane-red' : 'border-arcane-gray-10'"
            @click="open = !open"
        >
            <p
                class="text-arcane-gray-50 bg-white transition-all duration-200 ease-in-out !m-0 w-fit"
                :class="model ? 'text-xs leading-4 -translate-y-6 px-1' : 'text-base leading-6'"
            >
                {{ props.placeholder }}
            </p>
            <p
                class="!m-0 text-base leading-6 absolute left-4 top-4 transition-all duration-200 ease-in-out"
                :class="model ? 'opacity-100' : 'opacity-0'"
            >
                {{ model }}
            </p>
            <Chevron class="absolute right-4 top-4" />
        </div>
        <Transition mode="out-in">
            <span v-if="props.error" class="text-arcane-red text-xs leading-4 pt-1 pl-4">
                {{ props.error }}
            </span>
        </Transition>
        <Transition mode="out-in">
            <div v-show="open" class="absolute w-full top-full left-0 z-10 max-h-[320px] shadow-lg bg-white">
                <div v-if="props.search" class="bg-arcane-gray-20 rounded-lg flex items-center gap-1 p-2.5 m-4 relative">
                    <Search />
                    <input type="text" placeholder="Поиск" class="bg-transparent outline-none" v-model="searchInput">
                    <Close
                        class="absolute right-3 top-[50%] -translate-y-1/2 transition-all duration-200 ease-in-out cursor-pointer"
                        :class="searchInput ? 'opacity-100' : 'opacity-0 pointer-events-none'"
                        @click="searchInput = ''"
                    />
                </div>
                <div class="flex flex-col pb-2 max-h-[242px] overflow-y-auto">
                    <p v-if="!filteredOptions.length" class="text-base leading-[120%] text-arcane-gray-50 w-full text-center !m-0 p-4">
                        Ничего не найдено
                    </p>
                    <div v-else>
                        <div
                            v-for="option in filteredOptions"
                            class="p-4 cursor-pointer transition-all duration-200 ease-in-out"
                            :class="model === option.name ? 'bg-arcane-gray-10/50' : 'hover:bg-arcane-gray-10/20'"
                            @click="onOptionClick(option.name)"
                        >
                            <div v-html="option.html"></div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>