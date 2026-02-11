import { useMutation } from '@tanstack/react-query'
import { termsApi } from '../services/termsApi'
import { useAuthStore } from '../store/authStore'

export const useTerms = () => {
  const { termsAccepted, setTermsAccepted } = useAuthStore()

  const acceptMutation = useMutation({
    mutationFn: termsApi.accept,
    onSuccess: () => {
      setTermsAccepted(true)
    },
  })

  return {
    termsAccepted,
    acceptTerms: () => acceptMutation.mutate(),
    isAccepting: acceptMutation.isPending,
    acceptError: acceptMutation.error,
  }
}
