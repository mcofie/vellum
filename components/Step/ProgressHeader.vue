<template>
  <div class="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between bg-off-white/80 backdrop-blur-md">
    <div class="flex items-center space-x-2">
      <div class="w-8 h-8 bg-navy rounded-lg flex items-center justify-center text-white font-bold">V</div>
      <span class="text-navy font-bold text-xl tracking-tight">Vellum</span>
    </div>

    <div class="flex-1 max-w-md mx-8">
      <div class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          class="h-full bg-teal-accent transition-all duration-500 ease-out"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>

    <div class="flex items-center space-x-4">
      <button @click="save" class="text-navy/60 hover:text-navy text-sm font-medium transition-colors">
        Save & Exit
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  progress: number
}>()

const emit = defineEmits(['save'])
const save = () => emit('save')
</script>
