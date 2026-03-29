<template>
  <StepLayout 
    :progress="progress" 
    :showBack="currentStepIndex > 0"
    :nextLabel="currentStep.id === 'review' ? 'Generate PDF' : 'Continue'"
    @next="handleNext"
    @back="back"
  >
    <template #question>
      <div class="space-y-4">
        <h2 class="text-4xl md:text-5xl font-extrabold text-navy tracking-tight leading-tight">
          {{ questionTitle }}
        </h2>
        <p class="text-lg text-navy/60 font-medium">
          {{ questionDescription }}
        </p>
      </div>
    </template>

    <!-- Dynamic Step Content -->
    <div class="fade-in">
      <!-- Step 1: Start -->
      <div v-if="currentStep.id === 'start'" class="space-y-6">
        <ChoiceCard 
          title="I'm writing for myself" 
          description="Most common choice. Write your own Will." 
          value="single" 
          :selected="true"
        >
          <template #icon>
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </template>
        </ChoiceCard>
        
        <ChoiceCard 
          title="I'm writing for someone else" 
          description="A legal guardian or power of attorney process." 
          value="other" 
          :selected="false"
        >
          <template #icon>
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </template>
        </ChoiceCard>
      </div>

      <!-- Step 2: Personal Details -->
      <div v-if="currentStep.id === 'personal'" class="grid grid-cols-1 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-bold text-navy/60 uppercase tracking-widest pl-2">Full Name (as on Ghana Card)</label>
          <input 
            v-model="personalDetails.fullName" 
            type="text" 
            class="w-full px-8 py-5 rounded-2xl bg-off-white border-2 border-transparent focus:border-teal-accent focus:bg-white transition-all outline-none text-xl font-bold"
            placeholder="Kojo Mensah"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-bold text-navy/60 uppercase tracking-widest pl-2">Ghana Card ID</label>
          <input 
            v-model="personalDetails.ghanaCardId" 
            type="text" 
            class="w-full px-8 py-5 rounded-2xl bg-off-white border-2 border-transparent focus:border-teal-accent focus:bg-white transition-all outline-none text-xl font-bold"
            placeholder="GHA-123456789-0"
          />
        </div>
      </div>

      <!-- Ghanaian Specific: Customary Succession -->
      <div v-if="currentStep.id === 'succession'" class="space-y-6">
        <ChoiceCard 
          title="Family House / Stool Land" 
          description="Do you have any interest in family-owned properties?" 
          :value="true" 
          :selected="customarySuccession.hasFamilyLand"
          @select="customarySuccession.hasFamilyLand = true"
        >
          <template #icon>
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </template>
        </ChoiceCard>

        <ChoiceCard 
          title="No Traditional Assets" 
          description="I only have personal assets to bequeath." 
          :value="false" 
          :selected="!customarySuccession.hasFamilyLand"
          @select="customarySuccession.hasFamilyLand = false"
        >
          <template #icon>
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
          </template>
        </ChoiceCard>

        <Transition name="slide-fade">
          <div v-if="customarySuccession.hasFamilyLand" class="mt-8 space-y-4 p-8 bg-gold-accent/10 border-2 border-gold-accent/20 rounded-3xl">
            <h4 class="font-bold text-gold-accent flex items-center space-x-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
              <span>Cultural Context</span>
            </h4>
            <p class="text-navy/70 text-sm italic">
              Under the Intestate Succession Law of Ghana, family land has specific rules. We will ensure your Will clarifies your legal interests clearly.
            </p>
            <textarea 
              v-model="customarySuccession.details" 
              class="w-full p-6 rounded-2xl bg-white border-2 border-transparent focus:border-gold-accent outline-none font-medium h-32" 
              placeholder="Tell us about the family property or lineage requirements..."
            ></textarea>
          </div>
        </Transition>
      </div>

      <!-- Assets Step placeholder -->
      <div v-if="currentStep.id === 'assets'" class="text-center py-12">
        <p class="text-navy/40 italic">Asset entry interface coming soon...</p>
      </div>

    </div>
  </StepLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWillStore } from '~/stores/will'
import StepLayout from '~/components/Step/StepLayout.vue'
import ChoiceCard from '~/components/Input/ChoiceCard.vue'

const store = useWillStore()
const { personalDetails, customarySuccession } = storeToRefs(store)
const { currentStep, currentStepIndex, next, back, progress } = useNavigation()

const questionTitle = computed(() => {
  switch (currentStep.value?.id) {
    case 'start': return 'Whose Will is it?'
    case 'personal': return 'Tell us about you'
    case 'assets': return 'What do you own?'
    case 'succession': return 'Cultural Heritage'
    case 'beneficiaries': return 'Who should benefit?'
    case 'executors': return 'Trusted Executors'
    case 'review': return 'All set! Review time.'
    default: return 'Let\'s get started'
  }
})

const questionDescription = computed(() => {
  switch (currentStep.value?.id) {
    case 'personal': return 'We need your official details to ensure your Will is legally airtight under Ghanaian law.'
    case 'succession': return 'Ghanaian estate planning often involves stool land or family property with specific customary rules.'
    default: return 'Each question brings you closer to protecting your legacy.'
  }
})

const handleNext = () => {
  if (currentStep.value?.id === 'review') {
    generateWill()
  } else {
    next()
  }
}

const generateWill = async () => {
  // Logic to call server API
  alert('Generating legal document...')
}
</script>
