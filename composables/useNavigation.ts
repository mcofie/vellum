import { useWillStore } from '~/stores/will'

export const useNavigation = () => {
  const store = useWillStore()
  const router = useRouter()
  const route = useRoute()

  const steps = [
    { id: 'start', title: 'Getting Started', progress: 0 },
    { id: 'personal', title: 'Personal Details', progress: 15 },
    { id: 'assets', title: 'Your Assets', progress: 30 },
    { id: 'succession', title: 'Family & Custom', progress: 45 },
    { id: 'beneficiaries', title: 'Beneficiaries', progress: 60 },
    { id: 'executors', title: 'Executors', progress: 80 },
    { id: 'review', title: 'Review', progress: 95 },
  ]

  const currentStepIndex = computed(() => {
    const stepParam = route.params.step as string
    return steps.findIndex(s => s.id === stepParam) || 0
  })

  const currentStep = computed(() => steps[currentStepIndex.value])

  const next = () => {
    if (currentStepIndex.value < steps.length - 1) {
      const nextStep = steps[currentStepIndex.value + 1]
      router.push(`/create-will/${nextStep.id}`)
      store.saveToDatabase()
    }
  }

  const back = () => {
    if (currentStepIndex.value > 0) {
      const prevStep = steps[currentStepIndex.value - 1]
      router.push(`/create-will/${prevStep.id}`)
    } else {
      router.push('/')
    }
  }

  return {
    steps,
    currentStep,
    currentStepIndex,
    next,
    back,
    progress: computed(() => currentStep.value?.progress || 0)
  }
}
