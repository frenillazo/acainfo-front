import { cn } from '@/shared/utils/cn'

interface FormFieldControlledProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  error?: string
  helperText?: string
  onChange?: (value: string) => void
  rightElement?: React.ReactNode
}

export function FormFieldControlled({
  label,
  error,
  helperText,
  className,
  id,
  required,
  onChange,
  rightElement,
  ...props
}: FormFieldControlledProps) {
  const inputId = id || props.name

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className={cn('relative', rightElement && 'mt-1')}>
        <input
          id={inputId}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            rightElement ? 'block w-full' : 'mt-1 block w-full',
            'rounded-md border px-3 py-2 shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
            rightElement && 'pr-10',
            error ? 'border-red-500' : 'border-gray-300',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}
