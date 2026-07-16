import { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { usePendingEnrollmentsCount } from '@/features/enrollments/hooks/usePendingEnrollmentsCount'
import { cn } from '@/shared/utils/cn'
import {
  Home,
  GraduationCap,
  Calendar,
  BookOpen,
  Settings,
  Users,
  UserCircle,
  CheckCircle,
  CalendarDays,
  Clock,
  ClipboardList,
  UserCheck,
  X,
} from 'lucide-react'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  roles?: string[]
  end?: boolean // If true, only match exact path (for parent routes like Dashboard)
  /** Clave de contador a pintar como badge (ver `badges` en el componente). */
  badge?: 'pendingEnrollments'
}

const ICON_CLASS = 'h-5 w-5'

// Student navigation
const studentNavigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <Home className={ICON_CLASS} />,
    end: true, // Only match exact /dashboard path
  },
  {
    name: 'Mis Inscripciones',
    href: '/dashboard/enrollments',
    icon: <GraduationCap className={ICON_CLASS} />,
  },
  {
    name: 'Sesiones',
    href: '/dashboard/sessions',
    icon: <Calendar className={ICON_CLASS} />,
  },
  {
    name: 'Asignaturas',
    href: '/dashboard/subjects',
    icon: <BookOpen className={ICON_CLASS} />,
  },
  {
    name: 'Administracion',
    href: '/admin',
    icon: <Settings className={ICON_CLASS} />,
    roles: ['ADMIN'],
  },
]

// Admin navigation
const adminNavigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: <Home className={ICON_CLASS} />,
    end: true, // Only match exact /admin path
  },
  {
    name: 'Estudiantes',
    href: '/admin/users',
    icon: <Users className={ICON_CLASS} />,
  },
  {
    name: 'Profesores',
    href: '/admin/teachers',
    icon: <UserCircle className={ICON_CLASS} />,
  },
  {
    name: 'Inscripciones',
    href: '/admin/enrollments',
    icon: <CheckCircle className={ICON_CLASS} />,
    end: true,
  },
  {
    name: 'Solicitudes Pendientes',
    href: '/admin/enrollments/pending',
    icon: <UserCheck className={ICON_CLASS} />,
    badge: 'pendingEnrollments',
  },
  {
    name: 'Asignaturas',
    href: '/admin/subjects',
    icon: <BookOpen className={ICON_CLASS} />,
  },
  {
    name: 'Cursos',
    href: '/admin/courses',
    icon: <GraduationCap className={ICON_CLASS} />,
  },
  {
    name: 'Horarios',
    href: '/admin/schedules',
    icon: <CalendarDays className={ICON_CLASS} />,
  },
  {
    name: 'Sesiones',
    href: '/admin/sessions',
    icon: <Clock className={ICON_CLASS} />,
  },
  {
    name: 'Demanda',
    href: '/admin/demand',
    icon: <ClipboardList className={ICON_CLASS} />,
  },
  {
    // El menú de alumno lleva a /admin, pero no había vuelta: desde admin solo
    // se salía editando la URL.
    name: 'Volver a mi panel',
    href: '/dashboard',
    icon: <Home className={ICON_CLASS} />,
    roles: ['STUDENT'],
    end: true,
  },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const { hasRole } = useAuth()
  const location = useLocation()
  const isAdminSection = location.pathname.startsWith('/admin')

  // Choose navigation based on current section
  const navigation = isAdminSection ? adminNavigation : studentNavigation

  const filteredNavigation = navigation.filter((item) => {
    if (!item.roles) return true
    return item.roles.some((role) => hasRole(role))
  })

  const badges: Record<NonNullable<NavItem['badge']>, number> = {
    pendingEnrollments: usePendingEnrollmentsCount(isAdminSection && hasRole('ADMIN')),
  }

  const navRef = useRef<HTMLElement>(null)

  // `open` solo puede ser true en móvil: la hamburguesa que lo activa es
  // lg:hidden.
  useEffect(() => {
    if (!open) return

    // Al abrirlo con la hamburguesa, el foco entra en el menú...
    navRef.current?.querySelector('a')?.focus()

    // ...y Escape lo cierra, como cualquier capa modal.
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [open, onClose])

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-gray-600/75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300',
          // `invisible` (visibility: hidden) saca del orden de tabulación: el
          // sidebar cerrado en móvil solo se apartaba con -translate-x-full y
          // sus ~10 enlaces invisibles se tabulaban en TODAS las páginas.
          // Se resuelve con clases y no con matchMedia a propósito: que el
          // breakpoint lo decida el navegador y no un estado de JS que puede
          // quedarse obsoleto y dejar el menú inservible en escritorio.
          'lg:visible lg:static lg:translate-x-0',
          open ? 'visible translate-x-0' : 'invisible -translate-x-full'
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-gray-200 px-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="AcaInfo" className="h-14 w-14 object-contain" />
            <span
              className="text-2xl font-semibold tracking-wide text-gray-800"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              AcaInfo
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Cerrar menu de navegacion"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav ref={navRef} id="sidebar-nav" className="mt-6 px-3">
          <ul className="space-y-1">
            {filteredNavigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )
                  }
                >
                  {item.icon}
                  <span className="flex-1">{item.name}</span>
                  {item.badge && badges[item.badge] > 0 && (
                    <span
                      className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800"
                      aria-label={
                        badges[item.badge] === 1
                          ? '1 solicitud esperando respuesta'
                          : `${badges[item.badge]} solicitudes esperando respuesta`
                      }
                    >
                      {badges[item.badge]}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
