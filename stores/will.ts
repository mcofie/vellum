import { defineStore } from 'pinia'

export interface Asset {
  type: string
  location: string
  value: number
  description: string
}

export interface Person {
  fullName: string
  relationship: string
  ghanaCardId?: string
  address: string
}

export const useWillStore = defineStore('will', {
  state: () => ({
    currentStep: 1,
    personalDetails: {
      fullName: '',
      ghanaCardId: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
    },
    assets: [] as Asset[],
    beneficiaries: [] as Person[],
    executors: [] as Person[],
    guardians: [] as Person[],
    customarySuccession: {
      hasFamilyLand: false,
      familyHeadName: '',
      details: '',
    },
    choices: {
      funeralWishes: '',
      organDonation: false,
    }
  }),
  actions: {
    addAsset(asset: Asset) {
      this.assets.push(asset)
    },
    removeAsset(index: number) {
      this.assets.splice(index, 1)
    },
    addBeneficiary(person: Person) {
      this.beneficiaries.push(person)
    },
    removeBeneficiary(index: number) {
      this.beneficiaries.splice(index, 1)
    },
    updatePersonalDetails(details: Partial<typeof this.state.personalDetails>) {
      this.personalDetails = { ...this.personalDetails, ...details }
    },
    nextStep() {
      this.currentStep++
    },
    previousStep() {
      if (this.currentStep > 1) this.currentStep--
    },
    saveToDatabase() {
      // Mock database save (Supabase integration points here)
      console.log('Saving progress to database...', this.$state)
    }
  },
  persist: true // If using pinia-plugin-persistedstate which I should probably add later
})
