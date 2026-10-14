export type Illustration = 'partner' | 'children' | 'pets' | 'home' | 'matters' | 'summary' | 'contact'

export type ChoiceKey = 'partner' | 'children' | 'pets' | 'home'
export type Choice = 'yes' | 'no'
export type MatterKey = 'children' | 'belongings' | 'money' | 'pets' | 'funeral' | 'digital'

export interface ChoiceQuestion {
  key: ChoiceKey
  title: string
  illustration: Illustration
  options: { value: Choice, label: string, hint?: string }[]
}

export interface QuizAnswers {
  partner: Choice
  children: Choice
  pets: Choice
  home: Choice
  matters: MatterKey[]
}

export const choiceQuestions: ChoiceQuestion[] = [
  {
    key: 'partner',
    title: 'Do you have a partner?',
    illustration: 'partner',
    options: [
      { value: 'no', label: 'No', hint: 'Including separated, divorced or widowed' },
      { value: 'yes', label: 'Yes', hint: 'Married under any rites, engaged, or living together' }
    ]
  },
  {
    key: 'children',
    title: 'Do you have any children?',
    illustration: 'children',
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes', hint: 'Including step-children, adopted children, or one on the way' }
    ]
  },
  {
    key: 'pets',
    title: 'Any pets in the family?',
    illustration: 'pets',
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes', hint: 'Cats, dogs, fish — they all count' }
    ]
  },
  {
    key: 'home',
    title: 'Do you own a house or land?',
    illustration: 'home',
    options: [
      { value: 'no', label: 'No', hint: 'That’s okay — you don’t need property to make a will' },
      { value: 'yes', label: 'Yes', hint: 'Including family land, or a house you’re still building' }
    ]
  }
]

export const matterOptions: { value: MatterKey, label: string, requires?: ChoiceKey }[] = [
  { value: 'children', label: 'Who looks after my children', requires: 'children' },
  { value: 'belongings', label: 'Who gets my things' },
  { value: 'money', label: 'My savings and mobile money' },
  { value: 'pets', label: 'Who cares for my pets', requires: 'pets' },
  { value: 'funeral', label: 'My funeral wishes' },
  { value: 'digital', label: 'My online accounts and photos' }
]

const choices: readonly unknown[] = ['yes', 'no']

export function parseQuizAnswers(input: unknown): QuizAnswers | null {
  if (!input || typeof input !== 'object') return null
  const raw = input as Record<string, unknown>

  for (const { key } of choiceQuestions) {
    if (!choices.includes(raw[key])) return null
  }

  if (!Array.isArray(raw.matters) || !raw.matters.length) return null
  const allowed = matterOptions.map(({ value }) => value as unknown)
  if (raw.matters.some((matter) => !allowed.includes(matter))) return null

  return {
    partner: raw.partner as Choice,
    children: raw.children as Choice,
    pets: raw.pets as Choice,
    home: raw.home as Choice,
    matters: [...new Set(raw.matters as MatterKey[])]
  }
}

export interface Stake {
  without: string
  with: string
}

// Written for Ghana's intestacy rules. Ordered by how much each one matters to the
// people left behind; the summary shows the first few that apply.
const stakes: { applies: (answers: QuizAnswers) => boolean, stake: Stake }[] = [
  {
    applies: (answers) => answers.children === 'yes',
    stake: { without: 'Your family or a court may have to decide who raises your children.', with: 'You name the guardian you trust.' }
  },
  {
    applies: (answers) => answers.partner === 'yes',
    stake: { without: 'Even a spouse must share what you leave with your parents and wider family — and a partner you haven’t married may get nothing.', with: 'You decide exactly what your partner receives.' }
  },
  {
    applies: (answers) => answers.home === 'yes',
    stake: { without: 'Family houses and land are a common source of disputes, and widows and children can end up pushed out.', with: 'You decide who it goes to, in writing.' }
  },
  {
    applies: (answers) => answers.matters.includes('money'),
    stake: { without: 'Bank and mobile money accounts can stay locked until the court grants letters of administration, which can take months.', with: 'Your executor knows what you have and who it’s for.' }
  },
  {
    applies: (answers) => answers.pets === 'yes',
    stake: { without: 'No one is named to take your pets in.', with: 'You pick their next loving home.' }
  },
  {
    applies: (answers) => answers.matters.includes('funeral'),
    stake: { without: 'Family can end up disagreeing over your funeral at the hardest time.', with: 'Everyone knows exactly what you’d want.' }
  },
  {
    applies: (answers) => answers.matters.includes('digital'),
    stake: { without: 'Your accounts and photos can be locked away for good.', with: 'Someone you trust gets the keys.' }
  },
  {
    applies: (answers) => answers.matters.includes('belongings'),
    stake: { without: 'Relatives can end up arguing over what you would have wanted.', with: 'Your wishes are clear, so there’s nothing to argue about.' }
  }
]

export function stakesFor(answers: QuizAnswers, limit = 4) {
  return stakes.filter(({ applies }) => applies(answers)).slice(0, limit).map(({ stake }) => stake)
}

export function summaryHeadline(answers: QuizAnswers) {
  if (answers.children === 'yes') return 'Your children are the best reason to do this.'
  if (answers.partner === 'yes') return 'Your partner shouldn’t have to guess.'
  if (answers.pets === 'yes') return 'Someone should know who’ll look after them.'
  return 'Your wishes deserve to be written down.'
}

export const funnelSteps = ['partner', 'children', 'pets', 'home', 'matters', 'summary', 'contact', 'done'] as const
export type FunnelStep = typeof funnelSteps[number]

// Accepts Ghanaian local numbers (024 123 4567) and international numbers (+233 24 123 4567),
// and returns them in international form, or null when the number cannot be valid.
export function normalizePhone(input: unknown) {
  if (typeof input !== 'string') return null
  const digits = input.trim().replace(/[\s\-().]/g, '')
  if (/^0\d{9}$/.test(digits)) return `+233${digits.slice(1)}`
  if (/^233\d{9}$/.test(digits)) return `+${digits}`
  if (/^\+\d{8,15}$/.test(digits)) return digits
  return null
}
