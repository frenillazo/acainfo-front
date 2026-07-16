import { createElement } from 'react'
import { getFileIcon } from '../types/material.types'

interface MaterialFileIconProps {
  extension: string
  className?: string
}

/**
 * Icono del tipo de fichero.
 *
 * Envuelve el mapeo extensión → icono de lucide: asignar el componente a una
 * variable en mitad del render dispara la regla de lint "Cannot create
 * components during render" (no puede saber que la referencia es estable).
 */
export function MaterialFileIcon({ extension, className }: MaterialFileIconProps) {
  return createElement(getFileIcon(extension), { className, 'aria-hidden': true })
}
