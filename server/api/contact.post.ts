interface ContactRequest {
  name?: unknown
  email?: unknown
  message?: unknown
  website?: unknown
}

const recentRequests = new Map<string, number[]>()
const rateLimitWindow = 60_000
const rateLimitCount = 5

export default defineEventHandler(async (event) => {
  const origin = getRequestHeader(event, 'origin')
  if (origin && new URL(origin).origin !== getRequestURL(event).origin) {
    throw createError({ statusCode: 403, statusMessage: 'Request origin is not allowed.' })
  }

  const body = await readBody<ContactRequest>(event)

  if (typeof body?.website === 'string' && body.website.trim()) {
    return { ok: true }
  }

  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const message = typeof body?.message === 'string' ? body.message.trim() : ''

  if (!name || name.length > 80) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a name under 80 characters.' })
  }
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a valid email address.' })
  }
  if (!message || message.length > 2000) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a message under 2,000 characters.' })
  }

  const now = Date.now()
  const ip = getRequestIP(event) || 'unknown'
  for (const [key, timestamps] of recentRequests) {
    const active = timestamps.filter((timestamp) => now - timestamp < rateLimitWindow)
    if (active.length) recentRequests.set(key, active)
    else recentRequests.delete(key)
  }

  const timestamps = recentRequests.get(ip) || []
  if (timestamps.length >= rateLimitCount) {
    throw createError({ statusCode: 429, statusMessage: 'Please wait before sending another request.' })
  }
  recentRequests.set(ip, [...timestamps, now])

  const webhookUrl = useRuntimeConfig(event).discordWebhookUrl
  if (!webhookUrl || !/^https:\/\/ptb\.discord\.com\/api\/webhooks\/\d+\/[\w.-]+$/.test(webhookUrl)) {
    throw createError({ statusCode: 503, statusMessage: 'Request messages are not configured.' })
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        allowed_mentions: { parse: [] },
        embeds: [{
          title: 'New Vellum request',
          color: 3245178,
          fields: [
            { name: 'Name', value: name, inline: true },
            { name: 'Email', value: email, inline: true },
            { name: 'Message', value: message }
          ],
          timestamp: new Date(now).toISOString()
        }]
      }),
      signal: AbortSignal.timeout(8000)
    })

    if (!response.ok) throw new Error('Discord webhook rejected the request.')
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Could not deliver your request.' })
  }

  return { ok: true }
})
