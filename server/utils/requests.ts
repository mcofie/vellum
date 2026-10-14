import { createHash, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

const webhookPattern = /^https:\/\/(?:(?:ptb|canary)\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w.-]+$/

export const vellumStorage = () => useStorage('vellum')

export function assertSameOrigin(event: H3Event) {
  const origin = getRequestHeader(event, 'origin')
  if (origin && new URL(origin).origin !== getRequestURL(event).origin) {
    throw createError({ statusCode: 403, statusMessage: 'Request origin is not allowed.' })
  }
}

// Stored in shared storage rather than memory so limits survive restarts and
// apply across instances. IPs are hashed so raw addresses are never written down.
export async function enforceRateLimit(event: H3Event, bucket: string, limit: number, windowMs = 60_000) {
  const now = Date.now()
  // Behind a hosting proxy the socket address is the proxy's, so trust X-Forwarded-For.
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const key = `ratelimit:${bucket}:${createHash('sha256').update(ip).digest('hex').slice(0, 24)}`
  const storage = vellumStorage()

  const timestamps = ((await storage.getItem<number[]>(key)) || []).filter((timestamp) => now - timestamp < windowMs)
  if (timestamps.length >= limit) {
    throw createError({ statusCode: 429, statusMessage: 'Please wait a moment before trying again.' })
  }
  await storage.setItem(key, [...timestamps, now])
}

export function assertAdmin(event: H3Event) {
  const expected = useRuntimeConfig(event).adminToken
  const provided = getRequestHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '') || ''
  const valid = expected.length > 0
    && provided.length === expected.length
    && timingSafeEqual(Buffer.from(provided), Buffer.from(expected))
  if (!valid) throw createError({ statusCode: 401, statusMessage: 'Unauthorized.' })
}

export function readName(value: unknown) {
  const name = typeof value === 'string' ? value.trim() : ''
  if (!name || name.length > 80) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a name under 80 characters.' })
  }
  return name
}

export function readOptionalEmail(value: unknown) {
  const email = typeof value === 'string' ? value.trim() : ''
  if (!email) return ''
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a valid email address, or leave it blank.' })
  }
  return email
}

// Returns whether the message was delivered. Callers save their data first, so a
// missing or failing webhook never loses anything.
export async function sendDiscordEmbed(event: H3Event, embed: Record<string, unknown>) {
  const webhookUrl = useRuntimeConfig(event).discordWebhookUrl
  if (!webhookUrl || !webhookPattern.test(webhookUrl)) {
    console.warn('[vellum] Discord webhook is not configured; skipping notification.')
    return false
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
    if (!response.ok) throw new Error(`Discord responded with ${response.status}`)
    return true
  } catch (error) {
    console.error('[vellum] Discord notification failed:', error)
    return false
  }
}
