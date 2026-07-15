import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatDate = (dateStr: string): string =>
  format(parseISO(dateStr), 'dd/MM/yyyy', { locale: es })

export const formatDateTime = (dateStr: string): string =>
  format(parseISO(dateStr), "dd/MM/yyyy 'a las' HH:mm", { locale: es })

export const formatDateLong = (dateStr: string): string =>
  format(parseISO(dateStr), "d 'de' MMMM 'de' yyyy", { locale: es })

// Variantes con Intl.toLocaleDateString (es-ES), la misma API que usaban las
// copias locales de los componentes: la salida es idéntica a la previa.

/** "13 jul" — para rangos y espacios compactos. */
export const formatDateShort = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })

/** "lun, 13 jul" — listados compactos con día de la semana. */
export const formatDateWithWeekday = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

/** "lunes, 13 de julio" — cabeceras cercanas en el tiempo (sin año). */
export const formatDateWithWeekdayLong = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

/** "lunes, 13 de julio de 2026" — páginas de detalle. */
export const formatDateFull = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

// Las variantes fecha+hora componen las dos partes con separador propio: el
// patrón de unión de Intl en es-ES depende de la versión de ICU (", " en
// ICU ≤75, " a las " en ICU 78) y rompía la salida entre entornos.

/** "13 de julio de 2026, 16:00" — timestamps de auditoría en páginas de detalle. */
export const formatDateTimeLong = (dateStr: string): string => {
  const d = new Date(dateStr)
  const date = d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  const time = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  return `${date}, ${time}`
}

/** "13 jul, 16:00" — timestamp compacto para cards. */
export const formatDateTimeShort = (dateStr: string): string => {
  const d = new Date(dateStr)
  const date = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  const time = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  return `${date}, ${time}`
}

/** Date → "yyyy-MM-dd" en hora LOCAL (para query params de la API). */
export const formatISODate = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const formatTime = (timeStr: string): string => {
  // Remove seconds from time string (e.g., "08:30:00" -> "08:30")
  if (timeStr && timeStr.length >= 5) {
    return timeStr.substring(0, 5)
  }
  return timeStr
}

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
