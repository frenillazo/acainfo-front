import { useState, useCallback } from 'react'

interface PromptDialogState {
  isOpen: boolean
  title: string
  message: string
  inputLabel?: string
  inputPlaceholder?: string
  confirmLabel?: string
  cancelLabel?: string
}

interface PromptOptions {
  title: string
  message: string
  inputLabel?: string
  inputPlaceholder?: string
  confirmLabel?: string
  cancelLabel?: string
}

export function usePromptDialog() {
  const [state, setState] = useState<PromptDialogState>({
    isOpen: false,
    title: '',
    message: '',
  })
  const [resolveRef, setResolveRef] = useState<((value: string | null) => void) | null>(null)

  const prompt = useCallback((options: PromptOptions): Promise<string | null> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        ...options,
      })
      setResolveRef(() => resolve)
    })
  }, [])

  const handleConfirm = useCallback((value: string) => {
    setState((prev) => ({ ...prev, isOpen: false }))
    resolveRef?.(value)
    setResolveRef(null)
  }, [resolveRef])

  const handleCancel = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }))
    resolveRef?.(null)
    setResolveRef(null)
  }, [resolveRef])

  return {
    dialogProps: {
      isOpen: state.isOpen,
      title: state.title,
      message: state.message,
      inputLabel: state.inputLabel,
      inputPlaceholder: state.inputPlaceholder,
      confirmLabel: state.confirmLabel,
      cancelLabel: state.cancelLabel,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    },
    prompt,
  }
}
