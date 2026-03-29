<template>
  <button 
    @click="$emit('select', value)"
    class="w-full p-8 mb-4 flex items-center justify-between rounded-3xl border-2 transition-all duration-300 group"
    :class="selected ? 'border-teal-accent bg-teal-accent/5' : 'border-gray-100 hover:border-navy hover:bg-navy/5 shadow-sm hover:shadow-md'"
  >
    <div class="flex items-center space-x-6">
      <div 
        class="w-16 h-16 rounded-full flex items-center justify-center transition-colors"
        :class="selected ? 'bg-teal-accent text-white shadow-lg' : 'bg-gray-100 text-navy group-hover:bg-navy group-hover:text-white'"
      >
        <slot name="icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </slot>
      </div>
      <div class="text-left">
        <h3 class="font-bold text-xl mb-1 text-navy">{{ title }}</h3>
        <p class="text-navy/60 leading-tight font-medium">{{ description }}</p>
      </div>
    </div>
    <div 
      class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all"
      :class="selected ? 'border-teal-accent bg-teal-accent text-white' : 'border-gray-200'"
    >
      <svg v-if="selected" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  value: any
  selected?: boolean
}>()

defineEmits(['select'])
</script>
