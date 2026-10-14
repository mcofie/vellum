import { funnelSteps } from '../../../shared/willQuiz'
import type { Lead } from '../intake.post'

// GET /api/admin/leads with `Authorization: Bearer <NUXT_ADMIN_TOKEN>`.
// Add ?format=csv to download the leads for a spreadsheet.
export default defineEventHandler(async (event) => {
  assertAdmin(event)

  const storage = vellumStorage()
  const leadKeys = await storage.getKeys('leads')
  const leads = (await Promise.all(leadKeys.map((key) => storage.getItem<Lead>(key))))
    .filter((lead): lead is Lead => Boolean(lead))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  if (getQuery(event).format === 'csv') {
    const header = ['createdAt', 'name', 'phone', 'whatsapp', 'email', 'partner', 'children', 'pets', 'home', 'matters', 'message', 'notified']
    const rows = leads.map((lead) => [
      lead.createdAt, lead.name, lead.phone, lead.whatsapp, lead.email,
      lead.answers.partner, lead.answers.children, lead.answers.pets, lead.answers.home,
      lead.answers.matters.join(' | '), lead.message, lead.notified
    ])
    setResponseHeader(event, 'content-type', 'text/csv; charset=utf-8')
    setResponseHeader(event, 'content-disposition', 'attachment; filename="vellum-leads.csv"')
    return [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n')
  }

  const funnel: Record<string, Record<string, number>> = {}
  for (const key of await storage.getKeys('funnel')) {
    const [, day, step] = key.split(':')
    if (!day || !step) continue
    funnel[day] ??= Object.fromEntries(funnelSteps.map((name) => [name, 0]))
    funnel[day][step] = (await storage.getItem<number>(key)) || 0
  }

  return { leads, funnel }
})

function csvCell(value: unknown) {
  const text = String(value ?? '')
  // Prefix formula characters so spreadsheets don't execute submitted text.
  // Normalised phone numbers (+233…) are digits only and safe as they are.
  const safe = /^[=+\-@]/.test(text) && !/^\+\d+$/.test(text) ? `'${text}` : text
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}
