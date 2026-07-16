import { useState, useEffect } from 'react'
import { useProfile } from '../hooks/useProfile'
import { PasswordField } from '@/shared/components/form'
import { Button, Alert } from '@/shared/components/ui'
import type { ChangePasswordRequest } from '../types/auth.types'

interface ChangePasswordFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function ChangePasswordForm({ onSuccess, onCancel }: ChangePasswordFormProps) {
  const { changePassword, isLoading, error, clearError } = useProfile()

  const [formData, setFormData] = useState<ChangePasswordRequest & { confirmPassword: string }>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [validationErrors, setValidationErrors] = useState<{
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>({})

  // Clear error when form changes
  useEffect(() => {
    if (error) {
      clearError()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData])

  const validateForm = (): boolean => {
    const errors: {
      currentPassword?: string
      newPassword?: string
      confirmPassword?: string
    } = {}

    if (!formData.currentPassword) {
      errors.currentPassword = 'La contraseña actual es obligatoria'
    }

    if (!formData.newPassword) {
      errors.newPassword = 'La nueva contraseña es obligatoria'
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'La nueva contraseña debe tener al menos 8 caracteres'
    } else if (formData.newPassword === formData.currentPassword) {
      errors.newPassword = 'La nueva contraseña debe ser distinta de la actual'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma la nueva contraseña'
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const success = await changePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    })

    if (success) {
      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      onSuccess?.()
    }
  }

  const handleChange = (
    field: keyof (ChangePasswordRequest & { confirmPassword: string }),
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear field-specific error when user types
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PasswordField
        label="Contraseña actual"
        name="currentPassword"
        value={formData.currentPassword}
        onChange={(value) => handleChange('currentPassword', value)}
        error={validationErrors.currentPassword}
        disabled={isLoading}
        autoComplete="current-password"
      />

      <PasswordField
        label="Nueva contraseña"
        name="newPassword"
        value={formData.newPassword}
        onChange={(value) => handleChange('newPassword', value)}
        minLength={6}
        error={validationErrors.newPassword}
        helperText="Mínimo 8 caracteres"
        disabled={isLoading}
        autoComplete="new-password"
      />

      <PasswordField
        label="Confirmar nueva contraseña"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={(value) => handleChange('confirmPassword', value)}
        error={validationErrors.confirmPassword}
        disabled={isLoading}
        autoComplete="new-password"
      />

      {error && <Alert variant="error" message={error} />}

      <div className="flex gap-3">
        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Cambiando..."
          className="flex-1"
        >
          Change Password
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
