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
      errors.currentPassword = 'Current password is required'
    }

    if (!formData.newPassword) {
      errors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters'
    } else if (formData.newPassword === formData.currentPassword) {
      errors.newPassword = 'New password must be different from current password'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
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
        label="Current Password"
        name="currentPassword"
        value={formData.currentPassword}
        onChange={(value) => handleChange('currentPassword', value)}
        error={validationErrors.currentPassword}
        disabled={isLoading}
        autoComplete="current-password"
      />

      <PasswordField
        label="New Password"
        name="newPassword"
        value={formData.newPassword}
        onChange={(value) => handleChange('newPassword', value)}
        minLength={6}
        error={validationErrors.newPassword}
        helperText="Minimum 6 characters"
        disabled={isLoading}
        autoComplete="new-password"
      />

      <PasswordField
        label="Confirm New Password"
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
          loadingText="Changing Password..."
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
