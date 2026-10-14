<template>
  <div class="will-quiz">
    <header v-if="step !== 'done'" class="quiz-bar">
      <button class="quiz-back glass" type="button" :disabled="!canGoBack" @click="back">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
        Back
      </button>
      <div class="quiz-progress" role="progressbar" aria-label="Progress" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
        <span :style="{ width: `${progress}%` }" />
      </div>
    </header>

    <Transition name="quiz-step" mode="out-in">
      <section :key="step" class="quiz-step">
        <WillQuizArt :scene="illustration" />

        <template v-if="question">
          <h2 id="dialog-title" ref="heading" tabindex="-1">{{ question.title }}</h2>
          <div class="quiz-choices">
            <button
              v-for="option in question.options"
              :key="option.value"
              class="quiz-choice"
              :class="{ selected: answers[question.key] === option.value }"
              type="button"
              :aria-pressed="answers[question.key] === option.value"
              @click="choose(question.key, option.value)"
            >
              <strong>{{ option.label }}</strong>
              <span v-if="option.hint">{{ option.hint }}</span>
            </button>
          </div>
        </template>

        <template v-else-if="step === 'matters'">
          <h2 id="dialog-title" ref="heading" tabindex="-1">What matters most to you?</h2>
          <p class="quiz-copy">Choose as many as you like.</p>
          <div class="quiz-options">
            <button
              v-for="option in availableMatters"
              :key="option.value"
              class="quiz-option"
              :class="{ selected: answers.matters.includes(option.value) }"
              type="button"
              :aria-pressed="answers.matters.includes(option.value)"
              @click="toggleMatter(option.value)"
            >
              <span class="tick" aria-hidden="true" />
              {{ option.label }}
            </button>
          </div>
          <div class="quiz-actions">
            <button class="button-primary" type="button" :disabled="!answers.matters.length" @click="proceed">
              Continue
            </button>
          </div>
        </template>

        <template v-else-if="step === 'summary' && completeAnswers">
          <p class="eyebrow">Here’s the honest truth</p>
          <h2 id="dialog-title" ref="heading" tabindex="-1">{{ summaryHeadline(completeAnswers) }}</h2>
          <p class="quiz-copy lead">
            Without a will, Ghana’s intestacy law decides who gets what using a fixed formula — with shares set aside for your parents and wider family. Your loved ones must also apply to court before they can manage anything you leave behind.
          </p>

          <ul class="stakes">
            <li v-for="stake in stakes" :key="stake.with">
              <p class="without"><span aria-hidden="true">✕</span><span><span class="visually-hidden">Without a will: </span>{{ stake.without }}</span></p>
              <p class="with"><span aria-hidden="true">✓</span><span><span class="visually-hidden">With a will: </span>{{ stake.with }}</span></p>
            </li>
          </ul>

          <aside class="myth">
            <template v-if="answers.home === 'no'">
              <strong>You don’t need a house or savings.</strong>
              Your phone, your photos, your accounts and the little things that mean the most — they all count.
            </template>
            <template v-else>
              <strong>It’s not about expecting the worst.</strong>
              It’s one of the kindest things you can do for the people you love — so they never have to guess.
            </template>
          </aside>

          <div class="quiz-actions sticky">
            <button class="button-primary" type="button" @click="proceed">Put my wishes in writing</button>
            <p>We’ll guide you through it, one simple step at a time.</p>
          </div>
        </template>

        <form v-else-if="step === 'contact'" class="request-form" @submit.prevent="submit">
          <h2 id="dialog-title" ref="heading" tabindex="-1">Where should we send your next steps?</h2>
          <label>
            Name
            <input v-model="contact.name" autocomplete="name" maxlength="80" required />
          </label>
          <label>
            Phone number
            <input v-model="contact.phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="20" placeholder="024 123 4567" required />
          </label>
          <label class="check">
            <input v-model="contact.whatsapp" type="checkbox" />
            <span>You can reach me on WhatsApp</span>
          </label>
          <label>
            <span>Email <span class="optional">Optional</span></span>
            <input v-model="contact.email" type="email" autocomplete="email" inputmode="email" maxlength="254" />
          </label>
          <label>
            <span>Anything else we should know? <span class="optional">Optional</span></span>
            <textarea v-model="contact.message" rows="3" maxlength="1000" />
          </label>
          <label class="website-field" aria-hidden="true">
            Website
            <input v-model="contact.website" tabindex="-1" autocomplete="off" />
          </label>
          <p class="form-note">Your answers and contact details are shared privately with the Vellum team so we can help you.</p>
          <p v-if="status" class="form-status" role="alert">{{ status }}</p>
          <button class="button-primary" type="submit" :disabled="submitting">
            {{ submitting ? 'Sending…' : 'Send my answers' }}
          </button>
        </form>

        <template v-else>
          <p class="eyebrow">You’ve taken the first step</p>
          <h2 id="dialog-title" ref="heading" tabindex="-1">Thank you, {{ firstName }}.</h2>
          <p class="quiz-copy">
            We’ll {{ contact.whatsapp ? 'message you on WhatsApp' : 'call you' }} at <strong>{{ contact.phone }}</strong> with what to do next. Most people put this off for years — you didn’t.
          </p>
          <div class="quiz-actions">
            <button class="button-primary" type="button" @click="$emit('close')">Done</button>
          </div>
        </template>
      </section>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {
  choiceQuestions,
  funnelSteps,
  normalizePhone,
  matterOptions,
  parseQuizAnswers,
  stakesFor,
  summaryHeadline,
  type Choice,
  type ChoiceKey,
  type Illustration,
  type MatterKey
} from '~~/shared/willQuiz'

defineEmits<{ close: [] }>()

type Step = ChoiceKey | 'matters' | 'summary' | 'contact' | 'done'

const steps: Step[] = [...choiceQuestions.map(({ key }) => key), 'matters', 'summary', 'contact', 'done']

const stepIndex = ref(0)
const heading = ref<HTMLElement | null>(null)
const submitting = ref(false)
const advancing = ref(false)
const status = ref('')
const answers = reactive<{ partner?: Choice, children?: Choice, pets?: Choice, home?: Choice, matters: MatterKey[] }>({ matters: [] })
const contact = reactive({ name: '', phone: '', whatsapp: true, email: '', message: '', website: '' })

const step = computed(() => steps[stepIndex.value]!)
const question = computed(() => choiceQuestions.find(({ key }) => key === step.value))
const illustration = computed<Illustration>(() => step.value === 'done' ? 'summary' : question.value?.illustration ?? step.value as Illustration)
const progress = computed(() => Math.round((stepIndex.value / (steps.length - 2)) * 100))
const canGoBack = computed(() => stepIndex.value > 0 && !submitting.value)
const firstName = computed(() => contact.name.trim().split(/\s+/)[0])
const completeAnswers = computed(() => parseQuizAnswers(answers))
const stakes = computed(() => completeAnswers.value ? stakesFor(completeAnswers.value) : [])

const availableMatters = computed(() =>
  matterOptions.filter(({ requires }) => !requires || answers[requires] === 'yes')
)

function choose(key: ChoiceKey, value: Choice) {
  if (advancing.value) return
  haptic('selection')
  answers[key] = value
  answers.matters = answers.matters.filter((matter) => availableMatters.value.some((option) => option.value === matter))
  // Let the selected state register before sliding to the next question.
  advancing.value = true
  window.setTimeout(() => {
    advancing.value = false
    next()
  }, 180)
}

function toggleMatter(value: MatterKey) {
  haptic('selection')
  answers.matters = answers.matters.includes(value)
    ? answers.matters.filter((matter) => matter !== value)
    : [...answers.matters, value]
}

function next() {
  stepIndex.value = Math.min(stepIndex.value + 1, steps.length - 1)
}

function proceed() {
  haptic('impact')
  next()
}

function back() {
  haptic('light')
  status.value = ''
  stepIndex.value = Math.max(stepIndex.value - 1, 0)
}

async function submit() {
  haptic('impact')
  const phone = normalizePhone(contact.phone)
  if (!phone) {
    haptic('error')
    status.value = 'Enter a valid phone number, like 024 123 4567.'
    return
  }
  submitting.value = true
  status.value = ''

  try {
    await $fetch('/api/intake', {
      method: 'POST',
      body: { ...contact, answers }
    })
    haptic('success')
    clearSavedProgress()
    next()
  } catch (error: any) {
    haptic('error')
    status.value = error?.data?.statusMessage || 'Your answers could not be sent. Please try again.'
  } finally {
    submitting.value = false
  }
}

function reset() {
  stepIndex.value = 0
  status.value = ''
  Object.assign(answers, { partner: undefined, children: undefined, pets: undefined, home: undefined, matters: [] })
  Object.assign(contact, { name: '', phone: '', whatsapp: true, email: '', message: '', website: '' })
  clearSavedProgress()
}

// Progress lives in sessionStorage so an accidental close or refresh doesn't lose it.
// It is cleared once the answers are sent, and the browser drops it when the tab closes.
const progressKey = 'vellum:quiz'

watch(() => contact.phone, () => { status.value = '' })

function clearSavedProgress() {
  try { sessionStorage.removeItem(progressKey) } catch {}
}

onMounted(() => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(progressKey) || 'null')
    const savedStep = steps.indexOf(saved?.step)
    if (savedStep > 0 && steps[savedStep] !== 'done') {
      Object.assign(answers, saved.answers)
      Object.assign(contact, saved.contact, { website: '' })
      stepIndex.value = savedStep
    }
  } catch {}

  watch([stepIndex, answers, contact], () => {
    if (step.value === 'done') return
    try {
      sessionStorage.setItem(progressKey, JSON.stringify({ step: step.value, answers, contact: { ...contact, website: '' } }))
    } catch {}
  }, { deep: true })

  watch(step, trackStep, { immediate: true })
})

// Anonymous funnel counts so we can see where people stop. Each step counts once per session.
function trackStep(name: Step) {
  if (!(funnelSteps as readonly string[]).includes(name)) return
  try {
    const seen = new Set<string>(JSON.parse(sessionStorage.getItem('vellum:funnel') || '[]'))
    if (seen.has(name)) return
    seen.add(name)
    sessionStorage.setItem('vellum:funnel', JSON.stringify([...seen]))
  } catch {}
  const payload = new Blob([JSON.stringify({ step: name })], { type: 'application/json' })
  if (!navigator.sendBeacon?.('/api/quiz-event', payload)) {
    fetch('/api/quiz-event', { method: 'POST', body: payload, keepalive: true }).catch(() => {})
  }
}

watch(stepIndex, async () => {
  await nextTick()
  // Wait for the out-in transition to mount the new step before moving focus.
  window.setTimeout(() => {
    heading.value?.focus({ preventScroll: true })
    heading.value?.closest('dialog')?.scrollTo({ top: 0 })
  }, 220)
})

defineExpose({ reset, isDone: computed(() => step.value === 'done') })
</script>

<style scoped>
.will-quiz {
  --ink: var(--vellum-ink);
  --muted: var(--vellum-muted);
  --brand: var(--vellum-primary);
  --brand-tint: rgb(36 90 166 / 9%);
  --tile: rgb(255 255 255 / 58%);
  --tile-hover: rgb(255 255 255 / 80%);
  --tile-stroke: rgb(255 255 255 / 85%);
  --tile-shadow:
    inset 0 1px 0 rgb(255 255 255 / 95%),
    0 0 0 0.5px rgb(23 45 70 / 9%),
    0 1px 2px rgb(23 45 70 / 5%),
    0 8px 24px -12px rgb(23 45 70 / 20%);
}

.quiz-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 32px;
  margin: -8px 50px 18px 0;
}

.quiz-back {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 12px 0 8px;
  border-radius: 999px;
  color: var(--ink);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 200ms ease, transform 220ms var(--ease-spring);
}

.quiz-back svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.quiz-back:hover {
  background: var(--glass-fill-hover);
}

.quiz-back:active {
  transform: scale(0.95);
}

.quiz-back:disabled {
  visibility: hidden;
}

.quiz-progress {
  flex: 1;
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background: rgb(23 45 70 / 8%);
  box-shadow: inset 0 1px 1px rgb(23 45 70 / 8%);
}

.quiz-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--vellum-blue), #4a86e0);
  box-shadow: 0 0 8px rgb(36 70 194 / 45%);
  transition: width 500ms var(--ease-spring);
}

.quiz-step {
  text-align: center;
}

.quiz-step .eyebrow {
  margin: 0 0 10px;
}

.quiz-step h2 {
  max-width: 460px;
  margin: 0 auto;
  font-family: 'Mynerve', cursive, sans-serif;
  font-size: clamp(28px, 6vw, 36px);
  font-weight: 400;
  line-height: 1.22;
  text-wrap: balance;
}

.quiz-step h2:focus {
  outline: none;
}

.quiz-copy {
  max-width: 470px;
  margin: 12px auto 0;
  color: #465564;
  font-size: 15px;
  line-height: 1.65;
  text-wrap: pretty;
}

.quiz-choices {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 26px;
}

.quiz-choice,
.quiz-option,
.stakes li {
  border: 1px solid var(--tile-stroke);
  background: var(--tile);
  box-shadow: var(--tile-shadow);
}

.quiz-choice {
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 6px;
  min-height: 124px;
  padding: 22px 18px;
  border-radius: 22px;
  color: var(--ink);
  font: inherit;
  text-align: center;
  cursor: pointer;
  transition: background-color 220ms ease, box-shadow 220ms ease, transform 300ms var(--ease-spring);
}

.quiz-choice:hover,
.quiz-option:hover {
  background: var(--tile-hover);
}

.quiz-choice:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 #fff,
    0 0 0 0.5px rgb(23 45 70 / 10%),
    0 16px 32px -14px rgb(23 45 70 / 28%);
}

.quiz-choice:active,
.quiz-option:active {
  transform: scale(0.98);
}

.quiz-choice:focus-visible,
.quiz-option:focus-visible {
  outline: 3px solid rgb(36 90 166 / 35%);
  outline-offset: 2px;
}

.quiz-choice.selected,
.quiz-option.selected {
  border-color: rgb(36 90 166 / 45%);
  background: linear-gradient(180deg, rgb(255 255 255 / 70%), rgb(219 230 250 / 70%));
  box-shadow:
    inset 0 1px 0 #fff,
    0 0 0 1px rgb(36 90 166 / 55%),
    0 10px 26px -12px rgb(36 90 166 / 45%);
}

.quiz-choice strong {
  font-size: 19px;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.quiz-choice span {
  max-width: 220px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.5;
}

.quiz-options {
  display: grid;
  gap: 8px;
  max-width: 420px;
  margin: 20px auto 0;
}

.quiz-option {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 54px;
  padding: 12px 16px;
  border-radius: 18px;
  color: var(--ink);
  font: inherit;
  font-size: 15px;
  text-align: left;
  cursor: pointer;
  transition: background-color 220ms ease, box-shadow 220ms ease, transform 300ms var(--ease-spring);
}

.tick {
  flex: none;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border: 1.5px solid rgb(23 45 70 / 25%);
  border-radius: 50%;
  background: rgb(255 255 255 / 70%);
  transition: background-color 200ms ease, border-color 200ms ease, transform 300ms var(--ease-spring);
}

.selected .tick {
  border-color: var(--brand);
  background: var(--brand);
  transform: scale(1.06);
}

.selected .tick::after {
  content: '';
  width: 9px;
  height: 5px;
  margin-top: -2px;
  border: solid #fff;
  border-width: 0 0 2px 2px;
  transform: rotate(-45deg);
}

.will-quiz .button-primary {
  min-height: 50px;
  padding: 0 28px;
  font-size: 15px;
}

.will-quiz .button-primary:disabled:not([type='submit']) {
  cursor: not-allowed;
  opacity: 0.35;
  box-shadow: none;
}

.quiz-actions {
  display: grid;
  justify-items: center;
  gap: 10px;
  margin-top: 24px;
}

.quiz-actions .button-primary {
  min-width: 240px;
}

.quiz-actions p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.lead {
  font-size: 15.5px;
}

.stakes {
  display: grid;
  gap: 10px;
  max-width: 500px;
  margin: 22px auto 0;
  padding: 0;
  list-style: none;
  text-align: left;
}

.stakes li {
  overflow: hidden;
  border-radius: 20px;
}

.stakes p {
  display: flex;
  gap: 10px;
  margin: 0;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.5;
}

.stakes p > span:first-child {
  flex: none;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  margin-top: 1px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
}

.without {
  color: #6b6f73;
}

.without > span:first-child {
  background: rgb(162 86 63 / 12%);
  color: #a2563f;
}

.with {
  border-top: 0.5px solid rgb(23 45 70 / 10%);
  background: var(--brand-tint);
  color: var(--ink);
  font-weight: 500;
}

.with > span:first-child {
  background: var(--brand);
  color: #fff;
  box-shadow: 0 2px 6px -1px rgb(36 90 166 / 50%);
}

.myth {
  max-width: 500px;
  margin: 14px auto 0;
  padding: 14px 16px;
  border: 1px solid rgb(226 165 43 / 30%);
  border-radius: 20px;
  background: linear-gradient(160deg, rgb(252 236 196 / 75%), rgb(246 222 160 / 55%));
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 70%);
  color: #4a3b17;
  font-size: 14px;
  line-height: 1.55;
  text-align: left;
}

.myth strong {
  display: block;
  margin-bottom: 2px;
  color: var(--ink);
}

.request-form {
  display: grid;
  gap: 15px;
  max-width: 440px;
  margin: 0 auto;
  text-align: left;
}

.request-form h2 {
  margin-bottom: 6px;
  text-align: center;
}

.request-form label {
  display: grid;
  gap: 6px;
  color: #263d55;
  font-size: 13px;
  font-weight: 500;
}

.optional {
  color: #7a8692;
  font-weight: 400;
}

.request-form .check {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: -6px;
  font-weight: 400;
  cursor: pointer;
}

.request-form .check input {
  width: 20px;
  height: 20px;
  min-height: 0;
  padding: 0;
  accent-color: var(--brand);
  box-shadow: none;
}

.request-form input,
.request-form textarea {
  width: 100%;
  border: 1px solid rgb(23 45 70 / 10%);
  border-radius: 14px;
  background: rgb(255 255 255 / 65%);
  box-shadow: inset 0 1px 2px rgb(23 45 70 / 6%);
  color: var(--ink);
  font: inherit;
  font-size: 16px;
  transition: border-color 200ms ease, box-shadow 200ms ease, background-color 200ms ease;
}

.request-form input {
  min-height: 48px;
  padding: 8px 14px;
}

.request-form textarea {
  min-height: 88px;
  padding: 12px 14px;
  resize: vertical;
}

.request-form input:focus,
.request-form textarea:focus {
  border-color: rgb(36 90 166 / 60%);
  outline: none;
  background: rgb(255 255 255 / 90%);
  box-shadow: 0 0 0 4px rgb(36 90 166 / 16%);
}

.form-note,
.form-status {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.5;
}

.form-status {
  color: #a03a2c;
}

.website-field,
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.quiz-step-enter-active,
.quiz-step-leave-active {
  transition: opacity 240ms ease, transform 360ms var(--ease-spring), filter 240ms ease;
}

.quiz-step-enter-from {
  opacity: 0;
  transform: translateX(20px) scale(0.99);
  filter: blur(4px);
}

.quiz-step-leave-to {
  opacity: 0;
  transform: translateX(-20px) scale(0.99);
  filter: blur(4px);
}

@media (max-width: 520px) {
  .quiz-bar {
    margin: 0 46px 12px 0;
  }

  .quiz-choices {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 20px;
  }

  .quiz-choice {
    justify-items: start;
    min-height: 0;
    padding: 16px 18px;
    border-radius: 20px;
    text-align: left;
  }

  .quiz-choice strong {
    font-size: 17px;
  }

  .quiz-choice span {
    max-width: none;
  }

  .quiz-actions .button-primary {
    width: 100%;
  }

  .quiz-actions.sticky {
    position: sticky;
    bottom: 0;
    margin: 18px -22px -22px;
    padding: 14px 22px max(18px, env(safe-area-inset-bottom));
    border-top: 0.5px solid rgb(255 255 255 / 70%);
    background: rgb(250 250 248 / 78%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    backdrop-filter: blur(24px) saturate(180%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .quiz-step-enter-active,
  .quiz-step-leave-active,
  .quiz-progress span,
  .quiz-choice,
  .quiz-option {
    transition: none;
  }
}
</style>
