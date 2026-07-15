import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  formatDateShort,
  formatDateWithWeekday,
  formatDateWithWeekdayLong,
  formatDateFull,
  formatDateTimeLong,
  formatDateTimeShort,
  formatISODate,
  formatTime,
  formatAcademicYear,
  currentAcademicYear,
  formatCurrency,
  formatFileSize,
} from './formatters'

// Fecha con hora fija a mediodía para que el resultado no dependa del huso
const LUNES = '2026-07-13T12:00:00'

describe('formatters de fecha', () => {
  it('formatDateShort → "13 jul"', () => {
    expect(formatDateShort(LUNES)).toBe('13 jul')
  })

  it('formatDateWithWeekday → "lun, 13 jul"', () => {
    expect(formatDateWithWeekday(LUNES)).toBe('lun, 13 jul')
  })

  it('formatDateWithWeekdayLong → "lunes, 13 de julio"', () => {
    expect(formatDateWithWeekdayLong(LUNES)).toBe('lunes, 13 de julio')
  })

  it('formatDateFull → "lunes, 13 de julio de 2026"', () => {
    expect(formatDateFull(LUNES)).toBe('lunes, 13 de julio de 2026')
  })

  it('formatDateTimeLong → "13 de julio de 2026, 16:00"', () => {
    expect(formatDateTimeLong('2026-07-13T16:00:00')).toBe('13 de julio de 2026, 16:00')
  })

  it('formatDateTimeShort → "13 jul, 16:00"', () => {
    expect(formatDateTimeShort('2026-07-13T16:00:00')).toBe('13 jul, 16:00')
  })

  it('formatISODate usa la fecha LOCAL (no UTC)', () => {
    expect(formatISODate(new Date(2026, 6, 13))).toBe('2026-07-13')
    expect(formatISODate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('formatTime', () => {
  it('recorta los segundos', () => {
    expect(formatTime('08:30:00')).toBe('08:30')
    expect(formatTime('16:00')).toBe('16:00')
  })
})

describe('formatAcademicYear', () => {
  it('compone la etiqueta del curso desde el año de inicio', () => {
    expect(formatAcademicYear(2025)).toBe('2025-26')
    expect(formatAcademicYear(2029)).toBe('2029-30')
  })
})

describe('currentAcademicYear', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('el 31 de agosto sigue siendo el curso anterior', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 31, 12, 0, 0))
    expect(currentAcademicYear()).toBe(2025)
  })

  it('el 1 de septiembre arranca el curso nuevo', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 1, 0, 0, 0))
    expect(currentAcademicYear()).toBe(2026)
  })

  it('en primavera el curso es el del año anterior', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 1, 15, 12, 0, 0))
    expect(currentAcademicYear()).toBe(2025)
  })
})

describe('formatCurrency', () => {
  // Intl con locale es-ES separa cifra y símbolo con espacio no separable (U+00A0)
  const nbsp = String.fromCharCode(160)

  it('formatea euros con coma decimal y símbolo al final', () => {
    expect(formatCurrency(45)).toBe(`45,00${nbsp}€`)
  })

  it('redondea a 2 decimales', () => {
    expect(formatCurrency(19.999)).toBe(`20,00${nbsp}€`)
  })
})

describe('formatFileSize', () => {
  it('formatea bytes a la unidad adecuada', () => {
    expect(formatFileSize(0)).toBe('0 Bytes')
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(1536)).toBe('1.5 KB')
    expect(formatFileSize(2 * 1024 * 1024)).toBe('2 MB')
  })
})
