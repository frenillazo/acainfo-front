import { useState } from 'react'
import { authApi } from '../services/authApi'
import type { UpdateProfileRequest, ChangePasswordRequest, User } from '../types/auth.types'

/**
 * Custom hook for profile management operations
 * Provides methods to update profile and change password
 */
export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Update user profile (first name, last name)
   * @param data - Profile update data
   * @returns Updated user or null on error
   */
  const updateProfile = async (data: UpdateProfileRequest): Promise<User | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedUser = await authApi.updateProfile(data)
      return updatedUser
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Change user password
   * @param data - Password change data (current and new password)
   * @returns true on success, false on error
   */
  const changePassword = async (data: ChangePasswordRequest): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      await authApi.changePassword(data)
      return true
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to change password'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null)
  }

  return {
    updateProfile,
    changePassword,
    isLoading,
    error,
    clearError,
  }
}
