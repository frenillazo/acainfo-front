import { useMutation } from '@tanstack/react-query'
import { termsApi } from '../services/termsApi'
import { useAuthStore } from '../store/authStore'

export const useTerms = () => {
  const { termsAccepted, setTermsAccepted } = useAuthStore()

  const acceptMutation = useMutation({
    // El componente ya pinta este error en contexto (formulario/modal).
    meta: { silentError: true },
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
