import { cn } from '@/shared/utils/cn'

interface FormTextareaControlledProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string
  error?: string
  helperText?: string
  onChange?: (value: string) => void
}

export function FormTextareaControlled({
  label,
  error,
  helperText,
  className,
  id,
  required,
  onChange,
  ...props
}: FormTextareaControlledProps) {
  const textareaId = id || props.name

  return (
    <div className="w-full">
      <label
        htmlFor={textareaId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <textarea
        id={textareaId}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'mt-1 block w-full rounded-md border px-3 py-2 shadow-sm',
          'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
          'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
        }
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${textareaId}-helper`} className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}
