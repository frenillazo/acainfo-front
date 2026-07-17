import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { config } from '@/shared/config/env'

/**
 * Título de pestaña por ruta. Sin esto las ~45 rutas comparten el mismo título:
 * el historial del navegador es inservible y un lector de pantalla no anuncia a
 * dónde has llegado al navegar.
 *
 * Se resuelve por patrón de ruta en vez de por página para no tocar 45 ficheros;
 * los detalles (`/:id`) no pueden dar el nombre real de la entidad, así que se
 * quedan con el de su sección.
 */
const TITLES: Array<[RegExp, string]> = [
  // Rutas del alumno
  [/^\/dashboard$/, 'Mi panel'],
  [/^\/dashboard\/enrollments/, 'Mis inscripciones'],
  [/^\/dashboard\/sessions/, 'Mis sesiones'],
  [/^\/dashboard\/subjects/, 'Asignaturas'],
  [/^\/dashboard\/profile/, 'Mi perfil'],

  // Rutas de admin (el orden importa: de la más específica a la más general)
  [/^\/admin$/, 'Administración'],
  [/^\/admin\/users/, 'Estudiantes'],
  [/^\/admin\/teachers/, 'Profesores'],
  [/^\/admin\/enrollments\/pending/, 'Solicitudes pendientes'],
  [/^\/admin\/enrollments/, 'Inscripciones'],
  [/^\/admin\/courses/, 'Cursos'],
  [/^\/admin\/schedules/, 'Horarios'],
  [/^\/admin\/sessions\/generate/, 'Generar sesiones'],
  [/^\/admin\/sessions/, 'Sesiones'],
  [/^\/admin\/subjects/, 'Asignaturas'],
  [/^\/admin\/demand/, 'Demanda'],
  [/^\/admin\/profile/, 'Mi perfil'],

  // Públicas
  [/^\/login/, 'Iniciar sesión'],
  [/^\/register/, 'Crear cuenta'],
  [/^\/verification-pending/, 'Verifica tu email'],
  [/^\/verify-email/, 'Verificar email'],
  [/^\/forgot-password/, 'Recuperar contraseña'],
  [/^\/reset-password/, 'Nueva contraseña'],
  [/^\/terminos/, 'Términos y condiciones'],
]

export function useDocumentTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    const match = TITLES.find(([pattern]) => pattern.test(pathname))
    document.title = match ? `${match[1]} — ${config.appName}` : config.appName
  }, [pathname])
}
