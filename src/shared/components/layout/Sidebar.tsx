import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { cn } from '@/shared/utils/cn'
import {
  Home,
  GraduationCap,
  Calendar,
  CreditCard,
  FileText,
  BookOpen,
  Settings,
  Users,
  UserCircle,
  CheckCircle,
  UsersRound,
  CalendarDays,
  Clock,
  ClipboardList,
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
}

const ICON_CLASS = 'h-5 w-5'

// Student navigation
const studentNavigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: <Home className={ICON_CLASS} />,
  },
  {
    name: 'Mis Inscripciones',
    href: '/enrollments',
    icon: <GraduationCap className={ICON_CLASS} />,
  },
  {
    name: 'Sesiones',
    href: '/sessions',
    icon: <Calendar className={ICON_CLASS} />,
  },
  {
    name: 'Pagos',
    href: '/payments',
    icon: <CreditCard className={ICON_CLASS} />,
  },
  {
    name: 'Materiales',
    href: '/materials',
    icon: <FileText className={ICON_CLASS} />,
  },
  {
    name: 'Asignaturas',
    href: '/subjects',
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
  },
  {
    name: 'Usuarios',
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
  },
  {
    name: 'Asignaturas',
    href: '/admin/subjects',
    icon: <BookOpen className={ICON_CLASS} />,
  },
  {
    name: 'Grupos',
    href: '/admin/groups',
    icon: <UsersRound className={ICON_CLASS} />,
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
    name: 'Pagos',
    href: '/admin/payments',
    icon: <CreditCard className={ICON_CLASS} />,
  },
  {
    name: 'Solicitudes de Grupo',
    href: '/admin/group-requests',
    icon: <ClipboardList className={ICON_CLASS} />,
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
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
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

        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {filteredNavigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
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
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
