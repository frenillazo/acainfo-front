import { useEffect, useRef } from 'react'
import type { Session } from '../../types/admin.types'
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  ClipboardList,
  Eye,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface SessionContextMenuProps {
  session: Session
  anchorPosition: { x: number; y: number }
  onClose: () => void
  onStart: (id: number) => void
  onComplete: (id: number) => void
  onCancel: (id: number) => void
  onPostpone: (id: number) => void
  onDelete: (id: number) => void
  onAttendance: (id: number) => void
  onViewDetail: (id: number) => void
}

interface MenuItem {
  label: string
  icon: React.ReactNode
  onClick: () => void
  className?: string
  show: boolean
}

export function SessionContextMenu({
  session,
  anchorPosition,
  onClose,
  onStart,
  onComplete,
  onCancel,
  onPostpone,
  onDelete,
  onAttendance,
  onViewDetail,
}: SessionContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Adjust position to prevent overflow
  useEffect(() => {
    if (!menuRef.current) return
    const rect = menuRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight

    if (rect.right > vw) {
      menuRef.current.style.left = `${anchorPosition.x - rect.width}px`
    }
    if (rect.bottom > vh) {
      menuRef.current.style.top = `${anchorPosition.y - rect.height}px`
    }
  }, [anchorPosition])

  const items: MenuItem[] = [
    {
      label: 'Iniciar',
      icon: <Play className="h-4 w-4" />,
      onClick: () => { onStart(session.id); onClose() },
      className: 'text-yellow-700',
      show: session.isScheduled,
    },
    {
      label: 'Completar',
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: () => { onComplete(session.id); onClose() },
      className: 'text-green-700',
      show: session.isInProgress,
    },
    {
      label: 'Pasar Lista',
      icon: <ClipboardList className="h-4 w-4" />,
      onClick: () => { onAttendance(session.id); onClose() },
      className: 'text-indigo-600',
      show: session.isInProgress || session.isCompleted,
    },
    {
      label: 'Posponer',
      icon: <Clock className="h-4 w-4" />,
      onClick: () => { onPostpone(session.id); onClose() },
      className: 'text-orange-600',
      show: session.isScheduled,
    },
    {
      label: 'Cancelar',
      icon: <XCircle className="h-4 w-4" />,
      onClick: () => { onCancel(session.id); onClose() },
      className: 'text-red-600',
      show: session.isScheduled,
    },
    {
      label: 'Eliminar',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => { onDelete(session.id); onClose() },
      className: 'text-red-600',
      show: session.isScheduled,
    },
    {
      label: 'Ver detalle',
      icon: <Eye className="h-4 w-4" />,
      onClick: () => { onViewDetail(session.id); onClose() },
      show: true,
    },
  ]

  const visibleItems = items.filter((item) => item.show)

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[180px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
      style={{ top: anchorPosition.y, left: anchorPosition.x }}
    >
      {visibleItems.map((item, i) => (
        <button
          key={i}
          onClick={item.onClick}
          className={cn(
            'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100',
            item.className ?? 'text-gray-700'
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  )
}
