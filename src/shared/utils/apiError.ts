import { isAxiosError } from 'axios'

/** Extrae el mensaje de error que devuelve la API (axios); si no hay, el fallback. */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const message = (err.response?.data as { message?: string } | undefined)?.message
    if (message) return message
  }
  return fallback
}
