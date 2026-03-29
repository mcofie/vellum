<template>
  <div class="min-h-screen pt-24 pb-12 flex flex-col items-center px-4 bg-off-white">
    <ProgressHeader :progress="progress" @save="$emit('save')" />

    <main class="w-full max-w-2xl flex-1 flex flex-col justify-center">
      <div class="glass-card p-10 md:p-16 mb-8 transform transition-all duration-500 hover:shadow-2xl">
        <div class="mb-4">
          <slot name="question"></slot>
        </div>

        <div class="mt-8">
          <slot></slot>
        </div>

        <div class="mt-16 flex items-center justify-between">
          <div>
            <button 
              v-if="showBack"
              @click="$emit('back')" 
              class="flex items-center space-x-2 text-navy/60 hover:text-navy font-semibold transition-all group"
            >
              <span class="transform group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back</span>
            </button>
          </div>

          <button 
            @click="$emit('next')"
            class="bg-navy text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-navy/90 hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center space-x-4 group"
          >
            <span>{{ nextLabel }}</span>
            <span class="transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>

      <p class="text-center text-navy/40 text-sm">
        All information is secure and encrypted.
      </p>
    </main>
  </div>
</template>

<script setup lang="ts">
import ProgressHeader from './ProgressHeader.vue'

defineProps({
  progress: { type: Number, default: 0 },
  showBack: { type: Boolean, default: true },
  nextLabel: { type: String, default: 'Continue' }
})

defineEmits(['next', 'back', 'save'])
</script>
