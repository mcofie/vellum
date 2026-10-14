import { choiceQuestions, matterOptions, parseQuizAnswers } from '../../shared/willQuiz'

interface IntakeRequest {
  name?: unknown
  email?: unknown
  message?: unknown
  answers?: unknown
  website?: unknown
}

export default defineEventHandler(async (event) => {
  assertSameOrigin(event)

  const body = await readBody<IntakeRequest>(event)

  if (typeof body?.website === 'string' && body.website.trim()) {
    return { ok: true }
  }

  const name = readName(body?.name)
  const email = readEmail(body?.email)
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  if (message.length > 1000) {
    throw createError({ statusCode: 400, statusMessage: 'Keep your note under 1,000 characters.' })
  }

  const answers = parseQuizAnswers(body?.answers)
  if (!answers) {
    throw createError({ statusCode: 400, statusMessage: 'Some answers are missing. Please go back and check them.' })
  }

  enforceRateLimit(event)

  const choiceFields = choiceQuestions.map(({ key, title }) => ({
    name: title,
    value: answers[key] === 'yes' ? 'Yes' : 'No',
    inline: true
  }))
  const matters = matterOptions
    .filter(({ value }) => answers.matters.includes(value))
    .map(({ label }) => `• ${label}`)
    .join('\n')

  await sendDiscordEmbed(event, {
    title: 'New will enquiry',
    color: 3245178,
    fields: [
      { name: 'Name', value: name, inline: true },
      { name: 'Email', value: email, inline: true },
      ...choiceFields,
      { name: 'What matters most', value: matters },
      ...(message ? [{ name: 'Note', value: message }] : [])
    ]
  })

  return { ok: true }
})
