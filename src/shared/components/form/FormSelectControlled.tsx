import { cn } from '@/shared/utils/cn'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface FormSelectControlledProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string
  options: SelectOption[]
  error?: string
  helperText?: string
  placeholder?: string
  onChange?: (value: string) => void
}

export function FormSelectControlled({
  label,
  options,
  error,
  helperText,
  placeholder,
  className,
  id,
  required,
  onChange,
  ...props
}: FormSelectControlledProps) {
  const selectId = id || props.name

  return (
    <div className="w-full">
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <select
        id={selectId}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm',
          'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
          'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
        }
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${selectId}-helper`} className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}
