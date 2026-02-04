import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatDate = (dateStr: string): string =>
  format(parseISO(dateStr), 'dd/MM/yyyy', { locale: es })

export const formatDateTime = (dateStr: string): string =>
  format(parseISO(dateStr), "dd/MM/yyyy 'a las' HH:mm", { locale: es })

export const formatDateLong = (dateStr: string): string =>
  format(parseISO(dateStr), "d 'de' MMMM 'de' yyyy", { locale: es })

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
