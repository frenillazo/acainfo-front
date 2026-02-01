import { useState } from 'react'
import { cn } from '@/shared/utils/cn'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  label: string
  error?: string
  helperText?: string
  onChange?: (value: string) => void
}

export function PasswordField({
  label,
  error,
  helperText,
  className,
  id,
  required,
  onChange,
  ...props
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
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
      <div className="relative mt-1">
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            'block w-full rounded-md border px-3 py-2 pr-10 shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
            error ? 'border-red-500' : 'border-gray-300',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
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
