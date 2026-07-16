import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { toast, useToast } from './useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.toasts.forEach((t) => result.current.removeToast(t.id))
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('un success se cierra solo a los 4s', () => {
    const { result } = renderHook(() => useToast())

    act(() => toast.success('Guardado'))
    expect(result.current.toasts).toHaveLength(1)

    act(() => void vi.advanceTimersByTime(4000))
    expect(result.current.toasts).toHaveLength(0)
  })

  it('un error dura más que un success: 4s no bastan para leerlo', () => {
    const { result } = renderHook(() => useToast())

    act(() => toast.error('No se ha podido completar la acción'))

    act(() => void vi.advanceTimersByTime(4000))
    expect(result.current.toasts).toHaveLength(1)

    act(() => void vi.advanceTimersByTime(6000))
    expect(result.current.toasts).toHaveLength(0)
  })

  it('pausar congela el auto-cierre y reanudar lo continúa por el tiempo restante', () => {
    const { result } = renderHook(() => useToast())

    act(() => toast.success('Guardado'))
    const id = result.current.toasts[0].id

    act(() => void vi.advanceTimersByTime(3000))
    act(() => result.current.pauseToast(id))

    // Con el ratón encima no se cierra por mucho que pase el tiempo.
    act(() => void vi.advanceTimersByTime(60_000))
    expect(result.current.toasts).toHaveLength(1)

    act(() => result.current.resumeToast(id))
    act(() => void vi.advanceTimersByTime(999))
    expect(result.current.toasts).toHaveLength(1)

    act(() => void vi.advanceTimersByTime(1))
    expect(result.current.toasts).toHaveLength(0)
  })

  it('cerrar a mano cancela el temporizador (no revive ni peta al vencer)', () => {
    const { result } = renderHook(() => useToast())

    act(() => toast.info('Aviso'))
    const id = result.current.toasts[0].id

    act(() => result.current.removeToast(id))
    expect(result.current.toasts).toHaveLength(0)

    act(() => void vi.advanceTimersByTime(10_000))
    expect(result.current.toasts).toHaveLength(0)
  })
})
