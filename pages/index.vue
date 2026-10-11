<template>
  <main class="vellum-page">
    <section class="introduction" aria-labelledby="page-title">
      <h1 id="page-title">Vellum</h1>
      <p class="eyebrow">Wills and digital legacy</p>
      <p class="description">
        Make a will. Protect your digital assets. Leave clear instructions for the people you love. Keep your wishes and important details together in one thoughtful plan.
      </p>
      <div class="actions">
        <button class="button-secondary" type="button" @click="openDialog('learn')">
          Learn more
        </button>
        <button class="button-primary" type="button" @click="openDialog('request')">
          Send a request
        </button>
      </div>
    </section>

    <section class="portrait-family" aria-label="A family together">
      <img
        src="/vellum-family.png"
        alt="A family of four together, represented as tactile felt characters"
      />
    </section>

    <dialog ref="dialog" class="request-dialog" aria-labelledby="dialog-title" @click="closeOnBackdrop">
      <div class="dialog-content">
        <button class="dialog-close" type="button" @click="closeDialog">Close</button>

        <template v-if="dialogMode === 'learn'">
          <p class="eyebrow">A clearer way to plan</p>
          <h2 id="dialog-title">Your wishes, all in one place.</h2>
          <p class="dialog-copy">
            Vellum brings your will, digital assets, and final instructions together, so the people you trust know what matters and what to do next.
          </p>
          <button class="button-primary" type="button" @click="dialogMode = 'request'">
            Send a request
          </button>
        </template>

        <form v-else class="request-form" @submit.prevent="submitRequest">
          <p class="eyebrow">Get in touch</p>
          <h2 id="dialog-title">Send a request</h2>
          <label>
            Name
            <input v-model="request.name" autocomplete="name" maxlength="80" required />
          </label>
          <label>
            Email
            <input v-model="request.email" type="email" autocomplete="email" maxlength="254" required />
          </label>
          <label>
            What would you like to know?
            <textarea v-model="request.message" rows="4" maxlength="2000" required />
          </label>
          <label class="website-field" aria-hidden="true">
            Website
            <input v-model="request.website" tabindex="-1" autocomplete="off" />
          </label>
          <p class="form-note">Your name, email, and message will be sent to the Vellum team via Discord.</p>
          <p v-if="status" class="form-status" role="status">{{ status }}</p>
          <button class="button-primary" type="submit" :disabled="submitting">
            {{ submitting ? 'Sending…' : 'Send request' }}
          </button>
        </form>
      </div>
    </dialog>
  </main>
</template>

<script setup lang="ts">
type DialogMode = 'learn' | 'request'

const dialog = ref<HTMLDialogElement | null>(null)
const dialogMode = ref<DialogMode>('learn')
const submitting = ref(false)
const status = ref('')
const request = reactive({ name: '', email: '', message: '', website: '' })

function openDialog(mode: DialogMode) {
  dialogMode.value = mode
  status.value = ''
  dialog.value?.showModal()
}

function closeDialog() {
  dialog.value?.close()
}

function closeOnBackdrop(event: MouseEvent) {
  if (event.target === dialog.value) closeDialog()
}

async function submitRequest() {
  submitting.value = true
  status.value = ''

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: request
    })
    status.value = 'Thanks. Your request has been sent.'
    request.name = ''
    request.email = ''
    request.message = ''
    request.website = ''
  } catch {
    status.value = 'Your request could not be sent. Please try again.'
  } finally {
    submitting.value = false
  }
}

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
      href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=DM+Serif+Display&family=Mynerve&display=swap'
    }
  ]
})
</script>

<style scoped>
.vellum-page {
  --vellum-primary: #245aa6;
  --vellum-primary-hover: #194781;
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

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 22px;
}

.button-primary,
.button-secondary {
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid #172d46;
  border-radius: 4px;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 160ms ease, color 160ms ease, border-color 160ms ease;
}

.button-primary {
  border-color: var(--vellum-primary);
  background: var(--vellum-primary);
  color: white;
}

.button-primary:hover:not(:disabled) {
  border-color: var(--vellum-primary-hover);
  background: var(--vellum-primary-hover);
}

.button-primary:disabled {
  cursor: wait;
  opacity: 0.65;
}

.button-secondary {
  background: transparent;
  color: #172d46;
}

.button-secondary:hover {
  background: rgb(23 45 70 / 7%);
}

.request-dialog {
  width: min(480px, calc(100% - 32px));
  max-height: min(90svh, 760px);
  margin: auto;
  padding: 0;
  overflow: auto;
  border: 1px solid rgb(23 45 70 / 12%);
  border-radius: 8px;
  background: #f8f7f3;
  color: #172d46;
  box-shadow: 0 24px 80px rgb(23 45 70 / 20%);
}

.request-dialog::backdrop {
  background: rgb(15 30 47 / 42%);
  backdrop-filter: blur(3px);
}

.dialog-content {
  position: relative;
  padding: 34px;
}

.dialog-close {
  position: absolute;
  top: 18px;
  right: 18px;
  padding: 6px 0 6px 12px;
  border: 0;
  background: transparent;
  color: #465564;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
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

.request-form {
  display: grid;
  gap: 15px;
}

.request-form .eyebrow {
  margin-bottom: -8px;
}

.request-form label {
  display: grid;
  gap: 6px;
  color: #263d55;
  font-size: 13px;
  font-weight: 500;
}

.request-form input,
.request-form textarea {
  width: 100%;
  border: 1px solid #cbd1d3;
  border-radius: 4px;
  background: #fff;
  color: #172d46;
  font: inherit;
  font-size: 15px;
}

.request-form input {
  min-height: 42px;
  padding: 8px 10px;
}

.request-form textarea {
  min-height: 100px;
  padding: 10px;
  resize: vertical;
}

.request-form input:focus,
.request-form textarea:focus {
  border-color: #317c7a;
  outline: 2px solid rgb(49 124 122 / 20%);
}

.form-note,
.form-status {
  margin: 0;
  color: #596775;
  font-size: 12px;
  line-height: 1.5;
}

.form-status {
  color: #23706e;
}

.website-field {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
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

  .actions {
    gap: 8px;
    margin-top: 18px;
  }

  .button-primary,
  .button-secondary {
    padding: 0 14px;
    font-size: 13px;
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
