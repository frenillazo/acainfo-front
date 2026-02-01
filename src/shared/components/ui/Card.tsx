import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'

const cardVariants = cva('rounded-lg border bg-white shadow-sm', {
  variants: {
    variant: {
      default: 'border-gray-200',
      error: 'border-red-200',
      warning: 'border-orange-200',
      success: 'border-green-200',
      interactive: 'border-gray-200 transition-shadow hover:shadow-md',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
})

export type CardVariant = NonNullable<VariantProps<typeof cardVariants>['variant']>
export type CardPadding = NonNullable<VariantProps<typeof cardVariants>['padding']>

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: 'div' | 'article' | 'section'
}

export function Card({
  children,
  className,
  variant,
  padding,
  as: Component = 'div',
  ...props
}: CardProps) {
  return (
    <Component className={cn(cardVariants({ variant, padding }), className)} {...props}>
      {children}
    </Component>
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  )
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function CardTitle({
  children,
  className,
  as: Component = 'h3',
  ...props
}: CardTitleProps) {
  return (
    <Component
      className={cn('text-lg font-semibold text-gray-900', className)}
      {...props}
    >
      {children}
    </Component>
  )
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div className={cn('mt-4', className)} {...props}>
      {children}
    </div>
  )
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn('mt-4 flex items-center justify-end gap-3', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { cardVariants }
