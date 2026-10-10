<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <h1 class="font-mynerve text-6xl sm:text-8xl font-normal text-navy text-center select-none">
      Vellum
    </h1>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Vellum',
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Mynerve&display=swap'
    }
  ]
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Mynerve&display=swap');

.font-mynerve {
  font-family: 'Mynerve', cursive, sans-serif;
}
</style>
