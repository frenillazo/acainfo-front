import { describe, it, expect } from 'vitest'
import {
  formatDateShort,
  formatDateWithWeekday,
  formatDateWithWeekdayLong,
  formatDateFull,
  formatDateTimeLong,
  formatDateTimeShort,
  formatISODate,
  formatTime,
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
