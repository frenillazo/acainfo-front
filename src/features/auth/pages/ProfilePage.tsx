import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { ProfileEditForm } from '../components/ProfileEditForm'
import { ChangePasswordForm } from '../components/ChangePasswordForm'

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null)

  const handleProfileSuccess = () => {
    setShowSuccessMessage('Profile updated successfully!')
    setTimeout(() => setShowSuccessMessage(null), 5000)
  }

  const handlePasswordSuccess = () => {
    setShowSuccessMessage('Password changed successfully!')
    setTimeout(() => setShowSuccessMessage(null), 5000)
    // Optionally switch back to profile tab
    setActiveTab('profile')
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{showSuccessMessage}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setShowSuccessMessage(null)}
                  className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Info Card */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">{user.fullName}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="mt-1 flex gap-2">
                {user.roles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                  >
                    {role}
                  </span>
                ))}
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === 'password'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Change Password
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-lg bg-white p-6 shadow">
          {activeTab === 'profile' && (
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Edit Profile Information
              </h3>
              <p className="mb-6 text-sm text-gray-500">
                Update your first and last name. Your email address cannot be changed.
              </p>
              <ProfileEditForm onSuccess={handleProfileSuccess} />
            </div>
          )}

          {activeTab === 'password' && (
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">Change Password</h3>
              <p className="mb-6 text-sm text-gray-500">
                Enter your current password and choose a new password. Your new password
                must be at least 6 characters long.
              </p>
              <ChangePasswordForm onSuccess={handlePasswordSuccess} />
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Account Information</h3>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Account Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(user.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
