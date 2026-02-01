import { useState, useEffect } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useAuthStore } from '../store/authStore'
import { FormFieldControlled } from '@/shared/components/form'
import { Button, Alert } from '@/shared/components/ui'
import type { UpdateProfileRequest } from '../types/auth.types'

interface ProfileEditFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProfileEditForm({ onSuccess, onCancel }: ProfileEditFormProps) {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const { updateProfile, isLoading, error, clearError } = useProfile()

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  })

  const [validationErrors, setValidationErrors] = useState<{
    firstName?: string
    lastName?: string
  }>({})

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
      })
    }
  }, [user])

  // Clear error when form changes
  useEffect(() => {
    if (error) {
      clearError()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData])

  const validateForm = (): boolean => {
    const errors: { firstName?: string; lastName?: string } = {}

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required'
    } else if (formData.firstName.length > 50) {
      errors.firstName = 'First name must not exceed 50 characters'
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required'
    } else if (formData.lastName.length > 50) {
      errors.lastName = 'Last name must not exceed 50 characters'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const updatedUser = await updateProfile(formData)

    if (updatedUser) {
      // Update global state with new user data
      setUser(updatedUser)
      onSuccess?.()
    }
  }

  const handleChange = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear field-specific error when user types
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const hasChanges =
    formData.firstName !== user?.firstName || formData.lastName !== user?.lastName

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormFieldControlled
        label="First Name"
        name="firstName"
        type="text"
        value={formData.firstName}
        onChange={(value) => handleChange('firstName', value)}
        maxLength={50}
        error={validationErrors.firstName}
        disabled={isLoading}
      />

      <FormFieldControlled
        label="Last Name"
        name="lastName"
        type="text"
        value={formData.lastName}
        onChange={(value) => handleChange('lastName', value)}
        maxLength={50}
        error={validationErrors.lastName}
        disabled={isLoading}
      />

      {error && <Alert variant="error" message={error} />}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={!hasChanges}
          isLoading={isLoading}
          loadingText="Updating..."
          className="flex-1"
        >
          Update Profile
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
