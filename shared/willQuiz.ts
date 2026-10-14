export type Illustration = 'partner' | 'children' | 'pets' | 'home' | 'matters' | 'summary' | 'contact'

export type ChoiceKey = 'partner' | 'children' | 'pets' | 'home'
export type Choice = 'yes' | 'no'
export type MatterKey = 'children' | 'belongings' | 'pets' | 'funeral' | 'digital'

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
      { value: 'yes', label: 'Yes', hint: 'Including engaged or living with a partner' }
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
    title: 'Do you own a home or land?',
    illustration: 'home',
    options: [
      { value: 'no', label: 'No', hint: 'That’s okay — you don’t need property to make a will' },
      { value: 'yes', label: 'Yes', hint: 'Including shared ownership or with a mortgage' }
    ]
  }
]

export const matterOptions: { value: MatterKey, label: string, reason: string, requires?: ChoiceKey }[] = [
  { value: 'children', label: 'Who looks after my children', reason: 'who looks after your children', requires: 'children' },
  { value: 'belongings', label: 'Who gets my things', reason: 'who receives your belongings — even the small, sentimental ones' },
  { value: 'pets', label: 'Who cares for my pets', reason: 'who takes care of your pets', requires: 'pets' },
  { value: 'funeral', label: 'My funeral wishes', reason: 'how you’d like to be remembered' },
  { value: 'digital', label: 'My online accounts and photos', reason: 'what happens to your online accounts and photos' }
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

// Ordered by how much each one matters to the people left behind; the summary shows the first few that apply.
const stakes: { applies: (answers: QuizAnswers) => boolean, stake: Stake }[] = [
  {
    applies: (answers) => answers.children === 'yes',
    stake: { without: 'A court could decide who raises your children.', with: 'You choose the guardian you trust.' }
  },
  {
    applies: (answers) => answers.partner === 'yes',
    stake: { without: 'Your partner may not inherit automatically — especially if you’re not married.', with: 'They’re protected, in black and white.' }
  },
  {
    applies: (answers) => answers.home === 'yes',
    stake: { without: 'Your home can be tied up for months, or shared out in ways you’d never choose.', with: 'You decide exactly who it goes to.' }
  },
  {
    applies: (answers) => answers.pets === 'yes',
    stake: { without: 'No one is named to take your pets in.', with: 'You pick their next loving home.' }
  },
  {
    applies: (answers) => answers.matters.includes('digital'),
    stake: { without: 'Your accounts and photos can be locked away for good.', with: 'Someone you trust gets the keys.' }
  },
  {
    applies: (answers) => answers.matters.includes('belongings'),
    stake: { without: 'Family can end up disagreeing over what you would have wanted.', with: 'Your wishes are clear, so there’s nothing to argue about.' }
  },
  {
    applies: (answers) => answers.matters.includes('funeral'),
    stake: { without: 'Loved ones are left guessing at the hardest time.', with: 'They know exactly what you’d want.' }
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
