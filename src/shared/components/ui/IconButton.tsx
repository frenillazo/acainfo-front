import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'
import { Spinner } from './Spinner'

const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:ring-gray-500',
        primary: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:ring-blue-500',
        danger: 'text-red-600 hover:bg-red-50 hover:text-red-700 focus:ring-red-500',
        success: 'text-green-600 hover:bg-green-50 hover:text-green-700 focus:ring-green-500',
        warning: 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 focus:ring-yellow-500',
        ghost: 'text-gray-400 hover:text-gray-500 focus:ring-gray-500',
      },
      size: {
        sm: 'p-1',
        md: 'p-2',
        lg: 'p-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export type IconButtonVariant = NonNullable<
  VariantProps<typeof iconButtonVariants>['variant']
>
export type IconButtonSize = NonNullable<VariantProps<typeof iconButtonVariants>['size']>

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: React.ReactNode
  label: string
  isLoading?: boolean
}

export function IconButton({
  icon,
  label,
  variant,
  size,
  isLoading = false,
  disabled,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(iconButtonVariants({ variant, size }), className)}
      aria-label={label}
      title={label}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" className="text-current" />
      ) : (
        <span className={iconSize}>{icon}</span>
      )}
    </button>
  )
}

export { iconButtonVariants }
