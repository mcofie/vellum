import { funnelSteps, type FunnelStep } from '../../shared/willQuiz'

// Anonymous funnel counts: one number per step per day, no personal data.
export default defineEventHandler(async (event) => {
  assertSameOrigin(event)

  const body = await readBody<{ step?: unknown }>(event)
  const step = body?.step as FunnelStep
  if (!funnelSteps.includes(step)) {
    throw createError({ statusCode: 400, statusMessage: 'Unknown step.' })
  }

  await enforceRateLimit(event, 'funnel', 40)

  const storage = vellumStorage()
  const key = `funnel:${new Date().toISOString().slice(0, 10)}:${step}`
  await storage.setItem(key, ((await storage.getItem<number>(key)) || 0) + 1)

  setResponseStatus(event, 204)
  return null
})
