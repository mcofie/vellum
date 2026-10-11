<template>
  <main class="vellum-page">
    <section class="introduction" aria-labelledby="page-title">
      <h1 id="page-title">Vellum</h1>
      <p class="eyebrow">A new chapter in legacy</p>
      <p class="description">
        Over the past decade, the financial profiles of urban Africans shifted dramatically. Modern founders, remote engineers, and diaspora professionals now accumulate wealth in liquid non-custodial crypto, multi-currency fintech wallets, offshore cap tables, and private equity stakes. Yet estate planning in West Africa remains tethered to 19th-century probate routines: handwritten wills stored in metal cabinets, unverified witnesses, and bureaucratic court registries.
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
  title: 'Vellum — A new chapter in legacy',
  meta: [
    {
      name: 'description',
      content: 'A more considered way to protect the wealth and people that matter.'
    }
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
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  background: #f8f7f3;
  color: #172d46;
  font-family: 'DM Sans', sans-serif;
}

.introduction {
  width: min(740px, calc(100% - 48px));
  margin: clamp(30px, 7.8svh, 86px) auto clamp(28px, 5svh, 45px);
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
  max-width: 690px;
  margin: 25px auto 0;
  color: #465564;
  font-size: clamp(14px, 1.2vw, 15px);
  line-height: 1.75;
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
    margin: clamp(28px, 6svh, 55px) auto clamp(22px, 4svh, 35px);
  }

  .eyebrow {
    font-size: 10px;
  }

  .description {
    margin-top: 20px;
    font-size: 14px;
    line-height: 1.72;
  }

  .portrait-family {
    padding: 0 12px;
  }

  .portrait-family img {
    max-width: 100%;
    max-height: 78svh;
  }
}

@media (max-height: 700px) and (min-width: 651px) {
  .introduction {
    margin-top: 18px;
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
    animation: arrive 800ms ease-out both;
  }
}

@keyframes arrive {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
