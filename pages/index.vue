<template>
  <main class="vellum-page">
    <section class="introduction" aria-labelledby="page-title">
      <h1 id="page-title">Vellum</h1>
      <p class="eyebrow">Wills and digital legacy</p>
      <p class="description">
        Make a will. Protect your digital assets. Leave clear instructions for the people you love. Keep your wishes and important details together in one thoughtful plan.
      </p>
    </section>

    <section class="portrait-family" aria-label="A family together">
      <img
        src="/vellum-family.png"
        alt="A family of four together, represented as tactile felt characters"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Vellum | Wills & Digital Legacy',
  meta: [
    {
      name: 'description',
      content: 'Create your will, protect your digital assets, and leave clear instructions for the people you love.'
    },
    { property: 'og:title', content: 'Vellum | Wills & Digital Legacy' },
    {
      property: 'og:description',
      content: 'Create your will, protect your digital assets, and leave clear instructions for the people you love.'
    },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'theme-color', content: '#f8f7f3' }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Mynerve&display=swap'
    }
  ]
})
</script>

<style scoped>
.vellum-page {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  background: #f8f7f3;
  color: #172d46;
  font-family: 'DM Sans', sans-serif;
}

.introduction {
  width: min(740px, calc(100% - 48px));
  margin: auto auto clamp(24px, 5svh, 45px);
  text-align: center;
}

.eyebrow {
  margin: 0 0 13px;
  color: #317c7a;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-family: 'Mynerve', cursive, sans-serif;
  font-size: clamp(48px, 7vw, 78px);
  font-weight: 400;
  line-height: 1.2;
}

.description {
  max-width: 650px;
  margin: 25px auto 0;
  color: #465564;
  font-size: clamp(14px, 1.2vw, 15px);
  line-height: 1.75;
  text-wrap: pretty;
}

.portrait-family {
  width: 100%;
  margin-top: auto;
  padding: 0 clamp(12px, 6.1vw, 88px) max(0px, env(safe-area-inset-bottom));
}

.portrait-family img {
  width: auto;
  max-width: min(100%, 1180px);
  height: auto;
  max-height: 88svh;
  display: block;
  margin: 0 auto;
  object-fit: contain;
  object-position: center bottom;
}

@media (min-width: 1500px) {
  .portrait-family {
    max-width: 1420px;
    margin: auto auto 0;
  }
}

@media (max-width: 650px) {
  .introduction {
    width: min(100% - 36px, 520px);
    margin: auto auto clamp(20px, 5svh, 35px);
  }

  .eyebrow {
    font-size: 10px;
  }

  .description {
    margin-top: 20px;
    font-size: 14px;
    line-height: 1.65;
  }

  .portrait-family {
    padding: 0 12px max(0px, env(safe-area-inset-bottom));
  }

  .portrait-family img {
    max-width: 100%;
    max-height: 78svh;
  }
}

@media (max-width: 380px) {
  .introduction {
    width: calc(100% - 32px);
  }

  h1 {
    font-size: 44px;
  }

  .description {
    font-size: 13px;
    line-height: 1.6;
  }
}

@media (max-height: 700px) and (min-width: 651px) {
  .introduction {
    margin-top: clamp(40px, 9svh, 64px);
    margin-bottom: 14px;
  }

  h1 {
    font-size: 52px;
  }

  .description {
    margin-top: 12px;
    font-size: 14px;
    line-height: 1.48;
  }

  .portrait-family img {
    max-height: calc(100svh - 300px);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .introduction {
    animation: arrive 700ms ease-out both;
  }

  .portrait-family img {
    animation: arrive 800ms ease-out both, family-float 7s ease-in-out 800ms infinite;
  }
}

@keyframes arrive {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes family-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}
</style>
