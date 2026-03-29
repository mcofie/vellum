<template>
  <div class="min-h-screen bg-off-white flex flex-col items-center justify-center p-8 text-center space-y-12">
    <div class="space-y-6 max-w-3xl fade-in overflow-hidden">
      <div class="flex items-center justify-center space-x-3 mb-4">
        <div class="w-12 h-12 bg-navy rounded-xl flex items-center justify-center text-white text-2xl font-bold">V</div>
        <span class="text-navy font-bold text-3xl tracking-tight">Vellum</span>
      </div>
      
      <h1 class="text-6xl md:text-8xl font-black text-navy leading-[0.9] tracking-tighter">
        Your Legacy, <br/>
        <span class="text-teal-accent">Clearly Defined.</span>
      </h1>
      <p class="text-xl md:text-2xl text-navy/60 font-medium max-w-xl mx-auto leading-relaxed">
        Writing a legally-binding Will in Ghana should be simple, personal, and profoundly respectful.
      </p>
    </div>

    <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
      <NuxtLink 
        to="/create-will/start"
        class="bg-navy text-white px-12 py-6 rounded-full font-bold text-xl hover:bg-navy/90 hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center space-x-4 shadow-xl group"
      >
        <span>Write my Will</span>
        <span class="transform group-hover:translate-x-2 transition-transform font-light">→</span>
      </NuxtLink>
      <button class="bg-white text-navy px-12 py-6 rounded-full font-bold text-xl border-2 border-transparent hover:border-navy transition-all shadow-sm">
        Learn more
      </button>
    </div>

    <div class="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
      <div class="flex items-center space-x-2 font-bold text-lg"><div class="w-2 h-2 bg-teal-accent rounded-full"></div><span>Legally Secure</span></div>
      <div class="flex items-center space-x-2 font-bold text-lg"><div class="w-2 h-2 bg-teal-accent rounded-full"></div><span>Ghanaian Context</span></div>
      <div class="flex items-center space-x-2 font-bold text-lg"><div class="w-2 h-2 bg-teal-accent rounded-full"></div><span>Private & Encrypted</span></div>
      <div class="flex items-center space-x-2 font-bold text-lg"><div class="w-2 h-2 bg-teal-accent rounded-full"></div><span>Instant Generation</span></div>
    </div>
  </div>
</template>

<style scoped>
.fade-in {
  animation: slideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
