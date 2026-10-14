// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  // Secrets stay empty here so they are never baked into a build. Nuxt fills them
  // at runtime from NUXT_DISCORD_WEBHOOK_URL and NUXT_ADMIN_TOKEN.
  runtimeConfig: {
    discordWebhookUrl: '',
    adminToken: ''
  },
  nitro: {
    storage: {
      // Leads, rate limits and funnel counts. The filesystem driver suits a single
      // Node server; on serverless hosts swap this for a shared driver such as Redis.
      vellum: { driver: 'fs', base: './.data/vellum' }
    }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  }
})
