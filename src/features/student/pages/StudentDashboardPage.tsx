import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { useStudentOverview } from '../hooks/useStudentOverview'
import { WelcomeCard } from '../components/WelcomeCard'
import { EnrollmentCard } from '../components/EnrollmentCard'
import { UpcomingSessionCard } from '../components/UpcomingSessionCard'
import { PaymentSummaryCard } from '../components/PaymentSummaryCard'
import { LoadingState } from '@/shared/components/common/LoadingState'

export function StudentDashboardPage() {
  const { hasRole, user, isLoading: isLoadingAuth } = useAuth()

  // Wait for auth to load before checking roles
  const isAdminOnly = user
    ? hasRole('ADMIN') && !hasRole('STUDENT')
    : false

  // Only fetch student data if user is loaded and is a student
  const { data: overview, isLoading, error } = useStudentOverview({
    enabled: !!user && !isAdminOnly,
  })

  // Redirect admin users to admin dashboard (only after auth is loaded)
  if (!isLoadingAuth && user && isAdminOnly) {
    return <Navigate to="/admin" replace />
  }

  if (isLoadingAuth || isLoading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Error al cargar el dashboard. Por favor, intenta de nuevo.
      </div>
    )
  }

  if (!overview) {
    return null
  }

  return (
    <div className="space-y-6">
      <WelcomeCard
        fullName={overview.fullName}
        waitingListCount={overview.waitingListCount}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Active Enrollments */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Mis Inscripciones Activas
              </h2>
              <span className="text-sm text-gray-500">
                {overview.activeEnrollments.length} inscripciones
              </span>
            </div>
            {overview.activeEnrollments.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {overview.activeEnrollments.map((enrollment) => (
                  <EnrollmentCard
                    key={enrollment.enrollmentId}
                    enrollment={enrollment}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
                No tienes inscripciones activas
              </div>
            )}
          </section>

          {/* Upcoming Sessions */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Próximas Sesiones
              </h2>
              <span className="text-sm text-gray-500">
                {overview.upcomingSessions.length} sesiones
              </span>
            </div>
            {overview.upcomingSessions.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {overview.upcomingSessions.map((session) => (
                  <UpcomingSessionCard
                    key={session.sessionId}
                    session={session}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
                No tienes sesiones próximas
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PaymentSummaryCard paymentStatus={overview.paymentStatus} />
        </div>
      </div>
    </div>
  )
}
