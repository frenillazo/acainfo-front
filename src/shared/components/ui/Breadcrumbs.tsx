import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  showHome?: boolean
  homeHref?: string
}

export function Breadcrumbs({
  items,
  showHome = true,
  homeHref = '/',
}: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-2 text-sm">
        {showHome && (
          <li className="flex items-center gap-2">
            <Link
              to={homeHref}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Inicio"
            >
              <Home className="h-4 w-4" />
            </Link>
          </li>
        )}
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
            {item.href ? (
              <Link to={item.href} className="text-gray-500 hover:text-gray-700">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
