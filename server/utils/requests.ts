import type { H3Event } from 'h3'

const recentRequests = new Map<string, number[]>()
const rateLimitWindow = 60_000
const rateLimitCount = 5
const webhookPattern = /^https:\/\/(?:(?:ptb|canary)\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w.-]+$/

export function assertSameOrigin(event: H3Event) {
  const origin = getRequestHeader(event, 'origin')
  if (origin && new URL(origin).origin !== getRequestURL(event).origin) {
    throw createError({ statusCode: 403, statusMessage: 'Request origin is not allowed.' })
  }
}

export function enforceRateLimit(event: H3Event) {
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
}

export function readName(value: unknown) {
  const name = typeof value === 'string' ? value.trim() : ''
  if (!name || name.length > 80) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a name under 80 characters.' })
  }
  return name
}

export function readEmail(value: unknown) {
  const email = typeof value === 'string' ? value.trim() : ''
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a valid email address.' })
  }
  return email
}

export async function sendDiscordEmbed(event: H3Event, embed: Record<string, unknown>) {
  const webhookUrl = useRuntimeConfig(event).discordWebhookUrl
  if (!webhookUrl || !webhookPattern.test(webhookUrl)) {
    throw createError({ statusCode: 503, statusMessage: 'Request messages are not configured.' })
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        allowed_mentions: { parse: [] },
        embeds: [{ ...embed, timestamp: new Date().toISOString() }]
      }),
      signal: AbortSignal.timeout(8000)
    })

    if (!response.ok) throw new Error('Discord webhook rejected the request.')
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Could not deliver your request.' })
  }
}
