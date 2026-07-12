import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getVisualSessionStatus } from './sessionStatus'

// Sesión de referencia: 11-jul-2026 de 10:00 a 12:00
const session = (status: string) => ({
  status,
  date: '2026-07-11',
  startTime: '10:00:00',
  endTime: '12:00:00',
})

const setNow = (iso: string) => vi.setSystemTime(new Date(iso))

describe('getVisualSessionStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('estados finales del back (no dependen de la hora)', () => {
    it('CANCELLED es cancelled aunque la sesión no haya empezado', () => {
      setNow('2026-07-11T08:00:00')
      expect(getVisualSessionStatus(session('CANCELLED'))).toBe('cancelled')
    })

    it('POSTPONED es postponed', () => {
      setNow('2026-07-11T11:00:00')
      expect(getVisualSessionStatus(session('POSTPONED'))).toBe('postponed')
    })

    it('COMPLETED es completed', () => {
      setNow('2026-07-11T08:00:00')
      expect(getVisualSessionStatus(session('COMPLETED'))).toBe('completed')
    })

    it('acepta el estado en minúsculas', () => {
      setNow('2026-07-11T08:00:00')
      expect(getVisualSessionStatus(session('cancelled'))).toBe('cancelled')
    })
  })

  describe('SCHEDULED transiciona visualmente según la hora', () => {
    it('antes de empezar es scheduled', () => {
      setNow('2026-07-11T09:59:59')
      expect(getVisualSessionStatus(session('SCHEDULED'))).toBe('scheduled')
    })

    it('a la hora exacta de inicio pasa a in_progress', () => {
      setNow('2026-07-11T10:00:00')
      expect(getVisualSessionStatus(session('SCHEDULED'))).toBe('in_progress')
    })

    it('durante la sesión es in_progress', () => {
      setNow('2026-07-11T11:30:00')
      expect(getVisualSessionStatus(session('SCHEDULED'))).toBe('in_progress')
    })

    it('a la hora exacta de fin pasa a completed', () => {
      setNow('2026-07-11T12:00:00')
      expect(getVisualSessionStatus(session('SCHEDULED'))).toBe('completed')
    })

    it('otro día posterior es completed', () => {
      setNow('2026-07-12T09:00:00')
      expect(getVisualSessionStatus(session('SCHEDULED'))).toBe('completed')
    })

    it('un día anterior es scheduled', () => {
      setNow('2026-07-10T12:30:00')
      expect(getVisualSessionStatus(session('SCHEDULED'))).toBe('scheduled')
    })
  })
})
