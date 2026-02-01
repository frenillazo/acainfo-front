import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'

const avatarVariants = cva(
  'flex flex-shrink-0 items-center justify-center rounded-full font-medium',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
      },
      color: {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        red: 'bg-red-100 text-red-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        purple: 'bg-purple-100 text-purple-600',
        gray: 'bg-gray-100 text-gray-600',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'blue',
    },
  }
)

export type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>['size']>
export type AvatarColor = NonNullable<VariantProps<typeof avatarVariants>['color']>

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  name: string
  src?: string
  className?: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({ name, src, size, color, className }: AvatarProps) {
  const initials = getInitials(name)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'flex-shrink-0 rounded-full object-cover',
          size === 'sm' && 'h-8 w-8',
          size === 'md' && 'h-10 w-10',
          size === 'lg' && 'h-12 w-12',
          size === 'xl' && 'h-16 w-16',
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(avatarVariants({ size, color }), className)}
      title={name}
      aria-label={name}
    >
      {initials}
    </div>
  )
}

export { avatarVariants }
