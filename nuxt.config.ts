// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    discordWebhookUrl: process.env.NUXT_DISCORD_WEBHOOK_URL || ''
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
