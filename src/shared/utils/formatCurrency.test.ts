import { describe, it, expect } from 'vitest'
import { formatCurrency } from './formatCurrency'

// Intl con locale es-ES separa cifra y símbolo con espacio no separable (U+00A0)
const nbsp = '\u00A0'

describe('formatCurrency', () => {
  it('formatea euros con coma decimal y símbolo al final', () => {
    expect(formatCurrency(45, 'EUR')).toBe(`45,00${nbsp}€`)
  })

  it('formatea decimales redondeando a 2 cifras', () => {
    expect(formatCurrency(19.999, 'EUR')).toBe(`20,00${nbsp}€`)
  })
})
