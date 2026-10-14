<template>
  <main class="vellum-page">
    <section class="introduction" aria-labelledby="page-title">
      <h1 id="page-title">Vellum</h1>
      <p class="eyebrow chip glass">Wills and digital legacy</p>
      <p class="description">
        Make a will. Protect your digital assets. Leave clear instructions for the people you love. Keep your wishes and important details together in one thoughtful plan.
      </p>
      <div class="actions">
        <button class="button-secondary" type="button" @click="openDialog('learn')">
          Learn more
        </button>
        <button class="button-primary" type="button" @click="openDialog('quiz')">
          Get started
        </button>
      </div>
    </section>

    <section class="portrait-family" aria-label="A family together">
      <picture>
        <source
          type="image/webp"
          srcset="/vellum-family-640.webp 640w, /vellum-family-960.webp 960w, /vellum-family-1280.webp 1280w, /vellum-family-1829.webp 1829w"
          sizes="(min-width: 1500px) 1180px, 92vw"
        />
        <img
          src="/vellum-family.png"
          width="1829"
          height="860"
          fetchpriority="high"
          decoding="async"
          alt="A family of four together, represented as tactile felt characters"
        />
      </picture>
    </section>

    <dialog ref="dialog" class="request-dialog" :class="{ wide: dialogMode === 'quiz' }" aria-labelledby="dialog-title" @click="closeOnBackdrop">
      <div class="dialog-content">
        <button class="dialog-close glass" type="button" aria-label="Close" @click="closeDialog">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
        </button>

        <template v-if="dialogMode === 'learn'">
          <p class="eyebrow">A clearer way to plan</p>
          <h2 id="dialog-title">Your wishes, all in one place.</h2>
          <p class="dialog-copy">
            Vellum brings your will, digital assets, and final instructions together, so the people you trust know what matters and what to do next.
          </p>
          <button class="button-primary" type="button" @click="startQuiz">
            Get started
          </button>
        </template>

        <WillQuiz v-else ref="quiz" @close="closeDialog" />
      </div>
    </dialog>
  </main>
</template>

<script setup lang="ts">
type DialogMode = 'learn' | 'quiz'

const dialog = ref<HTMLDialogElement | null>(null)
const dialogMode = ref<DialogMode>('learn')
const quiz = ref<{ reset: () => void, isDone: boolean } | null>(null)

function openDialog(mode: DialogMode) {
  haptic(mode === 'quiz' ? 'impact' : 'light')
  if (quiz.value?.isDone) quiz.value.reset()
  dialogMode.value = mode
  dialog.value?.showModal()
}

function startQuiz() {
  haptic('impact')
  dialogMode.value = 'quiz'
}

function closeDialog() {
  haptic('light')
  dialog.value?.close()
}

function closeOnBackdrop(event: MouseEvent) {
  if (event.target === dialog.value) closeDialog()
}

useSheetDrag(dialog, {
  // Only the quiz becomes a bottom sheet, and only at phone widths.
  enabled: () => dialogMode.value === 'quiz' && window.matchMedia('(max-width: 520px)').matches,
  onDismiss: () => dialog.value?.close()
})

const requestUrl = useRequestURL()
const canonicalUrl = new URL('/', requestUrl).href
const socialImageUrl = new URL('/og-image.jpg', requestUrl).href

useHead({
  title: 'Vellum | Wills and Digital Legacy',
  meta: [
    {
      name: 'description',
      content: 'Create your will, protect your digital assets, and leave clear instructions for the people you love.'
    },
    { property: 'og:title', content: 'Vellum | Wills and Digital Legacy' },
    {
      property: 'og:description',
      content: 'Create your will, protect your digital assets, and leave clear instructions for the people you love.'
    },
    { property: 'og:site_name', content: 'Vellum' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: socialImageUrl },
    { property: 'og:image:type', content: 'image/jpeg' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'The Vellum wordmark beside a family together, with the message: Make a will. Protect what matters.' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Vellum | Wills and Digital Legacy' },
    {
      name: 'twitter:description',
      content: 'Create your will, protect your digital assets, and leave clear instructions for the people you love.'
    },
    { name: 'twitter:image', content: socialImageUrl },
    { name: 'twitter:image:alt', content: 'The Vellum wordmark beside a family together, with the message: Make a will. Protect what matters.' },
    { name: 'theme-color', content: '#f6f5f1' }
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Mynerve&display=swap'
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
  overflow: hidden;
  background:
    radial-gradient(55% 45% at 12% 8%, rgb(36 70 194 / 13%), transparent 70%),
    radial-gradient(45% 40% at 90% 14%, rgb(226 165 43 / 16%), transparent 70%),
    radial-gradient(60% 40% at 50% 100%, rgb(36 70 194 / 8%), transparent 75%),
    var(--vellum-paper);
  color: var(--vellum-ink);
  font-family: 'DM Sans', sans-serif;
}

.chip {
  display: inline-block;
  margin: 10px 0 0;
  padding: 7px 14px;
  border-radius: 999px;
}

.introduction {
  width: min(740px, calc(100% - 48px));
  margin: auto auto clamp(24px, 5svh, 45px);
  text-align: center;
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
  margin: 22px auto 0;
  color: var(--vellum-muted);
  font-size: clamp(14px, 1.2vw, 15px);
  line-height: 1.75;
  text-wrap: pretty;
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 22px;
}

.request-dialog {
  width: min(480px, calc(100% - 32px));
  max-height: min(90svh, 760px);
  margin: auto;
  padding: 0;
  overflow: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--glass-stroke);
  border-radius: 28px;
  background: var(--glass-panel);
  color: var(--vellum-ink);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 90%),
    0 0 0 0.5px rgb(23 45 70 / 10%),
    0 30px 80px -20px rgb(15 30 47 / 45%);
  -webkit-backdrop-filter: blur(40px) saturate(190%);
  backdrop-filter: blur(40px) saturate(190%);
}

.request-dialog::backdrop {
  background: rgb(23 45 70 / 14%);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
  backdrop-filter: blur(10px) saturate(140%);
}

.request-dialog[open] {
  animation: dialog-in 420ms var(--ease-spring) backwards;
}

.request-dialog[open]::backdrop {
  animation: fade-in 300ms ease both;
}

.request-dialog.wide {
  width: min(620px, calc(100% - 32px));
  max-height: min(92svh, 860px);
}

.request-dialog.wide .dialog-content {
  padding-top: 26px;
}

.dialog-content {
  position: relative;
  padding: 34px;
}

.dialog-close {
  position: absolute;
  z-index: 2;
  top: 18px;
  right: 18px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 50%;
  color: var(--vellum-ink);
  cursor: pointer;
  transition: background-color 200ms ease, transform 220ms var(--ease-spring);
}

.dialog-close:hover {
  background: var(--glass-fill-hover);
}

.dialog-close:active {
  transform: scale(0.92);
}

.dialog-close:focus-visible {
  outline: 3px solid rgb(36 90 166 / 35%);
  outline-offset: 2px;
}

.dialog-close svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
}

@media (max-width: 520px) {
  .request-dialog.wide {
    width: 100%;
    max-width: 100%;
    max-height: 94dvh;
    margin: auto 0 0;
    border-width: 1px 0 0;
    border-radius: 30px 30px 0 0;
  }

  .request-dialog.wide .dialog-content {
    padding: 22px 22px max(22px, env(safe-area-inset-bottom));
  }

  .request-dialog.wide .dialog-content::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    width: 36px;
    height: 5px;
    border-radius: 999px;
    background: rgb(23 45 70 / 18%);
    transform: translateX(-50%);
  }

  .request-dialog.wide .dialog-close {
    top: 16px;
  }

  .request-dialog.wide[open] {
    animation-name: sheet-up;
  }
}

@keyframes dialog-in {
  from { opacity: 0; transform: translateY(12px) scale(0.96); }
  to { opacity: 1; transform: none; }
}

@keyframes sheet-up {
  from { transform: translateY(100%); }
  to { transform: none; }
}

@keyframes fade-in {
  from { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .request-dialog[open],
  .request-dialog[open]::backdrop {
    animation: none;
  }
}

.dialog-content .eyebrow {
  margin-top: 16px;
}

.dialog-content h2 {
  margin: 0;
  font-family: 'Mynerve', cursive, sans-serif;
  font-size: 34px;
  font-weight: 400;
  line-height: 1.28;
}

.dialog-copy {
  margin: 14px 0 24px;
  color: #465564;
  font-size: 15px;
  line-height: 1.65;
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

  .chip {
    font-size: 10px;
  }

  .description {
    margin-top: 20px;
    font-size: 14px;
    line-height: 1.65;
  }

  .actions {
    gap: 8px;
    margin-top: 18px;
  }

  .actions .button-primary,
  .actions .button-secondary {
    padding: 0 18px;
    font-size: 13.5px;
  }

  .dialog-content {
    padding: 28px 22px 22px;
  }

  .dialog-content h2 {
    font-size: 30px;
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
