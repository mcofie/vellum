import { randomUUID } from 'node:crypto'
import { choiceQuestions, matterOptions, normalizePhone, parseQuizAnswers, type QuizAnswers } from '../../shared/willQuiz'

interface IntakeRequest {
  name?: unknown
  phone?: unknown
  whatsapp?: unknown
  email?: unknown
  message?: unknown
  answers?: unknown
  website?: unknown
}

export interface Lead {
  id: string
  createdAt: string
  name: string
  phone: string
  whatsapp: boolean
  email: string
  message: string
  answers: QuizAnswers
  notified: boolean
}

export default defineEventHandler(async (event) => {
  assertSameOrigin(event)

  const body = await readBody<IntakeRequest>(event)

  if (typeof body?.website === 'string' && body.website.trim()) {
    return { ok: true }
  }

  const name = readName(body?.name)
  const phone = normalizePhone(body?.phone)
  if (!phone) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a valid phone number, like 024 123 4567.' })
  }
  const email = readOptionalEmail(body?.email)
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  if (message.length > 1000) {
    throw createError({ statusCode: 400, statusMessage: 'Keep your note under 1,000 characters.' })
  }

  const answers = parseQuizAnswers(body?.answers)
  if (!answers) {
    throw createError({ statusCode: 400, statusMessage: 'Some answers are missing. Please go back and check them.' })
  }

  await enforceRateLimit(event, 'intake', 5)

  const lead: Lead = {
    id: `${Date.now()}-${randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
    name,
    phone,
    whatsapp: body?.whatsapp !== false,
    email,
    message,
    answers,
    notified: false
  }
  const storage = vellumStorage()
  await storage.setItem(`leads:${lead.id}`, lead)

  const choiceFields = choiceQuestions.map(({ key, title }) => ({
    name: title,
    value: answers[key] === 'yes' ? 'Yes' : 'No',
    inline: true
  }))
  const matters = matterOptions
    .filter(({ value }) => answers.matters.includes(value))
    .map(({ label }) => `• ${label}`)
    .join('\n')
  const phoneValue = lead.whatsapp
    ? `${phone} · [WhatsApp](https://wa.me/${phone.slice(1)})`
    : phone

  lead.notified = await sendDiscordEmbed(event, {
    title: 'New will enquiry',
    color: 3245178,
    fields: [
      { name: 'Name', value: name, inline: true },
      { name: 'Phone', value: phoneValue, inline: true },
      ...(email ? [{ name: 'Email', value: email, inline: true }] : []),
      ...choiceFields,
      { name: 'What matters most', value: matters },
      ...(message ? [{ name: 'Note', value: message }] : [])
    ]
  })
  if (lead.notified) await storage.setItem(`leads:${lead.id}`, lead)

  return { ok: true }
})
