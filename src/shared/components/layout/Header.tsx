import { useAuth } from '@/features/auth'
import { cn } from '@/shared/utils/cn'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className={cn(
              'rounded-md p-2 text-gray-500 lg:hidden',
              'hover:bg-gray-100 hover:text-gray-600'
            )}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-gray-700 sm:block">
                {user.firstName} {user.lastName}
              </span>
              <button
                onClick={logout}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium text-gray-700',
                  'hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
