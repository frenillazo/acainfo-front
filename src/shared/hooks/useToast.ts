import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  message: string
}

/**
 * Un error suele traer más texto y más consecuencias que un "guardado": darle
 * los mismos 4s que a un success lo deja ilegible justo cuando más importa.
 */
const DURATIONS: Record<ToastType, number> = {
  success: 4000,
  info: 4000,
  warning: 6000,
  error: 10000,
}

interface ToastState {
  toasts: Toast[]
  addToast: (type: ToastType, message: string) => void
  removeToast: (id: string) => void
  /** Congela el auto-cierre mientras el usuario tiene el toast bajo el ratón o el foco. */
  pauseToast: (id: string) => void
  resumeToast: (id: string) => void
}

// Temporizadores vivos y su vencimiento, para poder pausar y reanudar sin
// reiniciar la cuenta desde cero.
const timers = new Map<string, { timeoutId: ReturnType<typeof setTimeout>; expiresAt: number }>()
const pausedRemaining = new Map<string, number>()

function clearTimer(id: string) {
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer.timeoutId)
    timers.delete(id)
  }
}

function scheduleRemoval(id: string, ms: number) {
  clearTimer(id)
  timers.set(id, {
    timeoutId: setTimeout(() => {
      timers.delete(id)
      pausedRemaining.delete(id)
      useToastStore.getState().removeToast(id)
    }, ms),
    expiresAt: Date.now() + ms,
  })
}

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (type, message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }))
    scheduleRemoval(id, DURATIONS[type])
  },
  removeToast: (id) => {
    clearTimer(id)
    pausedRemaining.delete(id)
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },
  pauseToast: (id) => {
    const timer = timers.get(id)
    if (!timer) return
    clearTimer(id)
    pausedRemaining.set(id, Math.max(0, timer.expiresAt - Date.now()))
  },
  resumeToast: (id) => {
    const remaining = pausedRemaining.get(id)
    if (remaining === undefined) return
    pausedRemaining.delete(id)
    scheduleRemoval(id, remaining)
  },
}))

export const toast = {
  success: (message: string) => useToastStore.getState().addToast('success', message),
  error: (message: string) => useToastStore.getState().addToast('error', message),
  info: (message: string) => useToastStore.getState().addToast('info', message),
  warning: (message: string) => useToastStore.getState().addToast('warning', message),
}

export function useToast() {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)
  const pauseToast = useToastStore((state) => state.pauseToast)
  const resumeToast = useToastStore((state) => state.resumeToast)
  return { toasts, removeToast, pauseToast, resumeToast }
}
