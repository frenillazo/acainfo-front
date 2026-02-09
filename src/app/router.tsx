import { createBrowserRouter } from 'react-router-dom'
import {
  ProtectedRoute,
  LoginPage,
  RegisterPage,
  ProfilePage,
  VerificationPendingPage,
  VerifyEmailPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from '@/features/auth'
import { LandingPage } from '@/features/landing'
import { StudentDashboardPage } from '@/features/student'
import { EnrollmentsPage, EnrollmentDetailPage } from '@/features/enrollments'
import { PaymentsPage } from '@/features/payments'
import { SubjectsPage, SubjectDetailPage } from '@/features/subjects'
import { SessionsPage, SessionDetailPage } from '@/features/sessions'
import { AttendanceHistoryPage } from '@/features/reservations'
import { MaterialsPage } from '@/features/materials'
import {
  AdminGroupRequestsPage,
  AdminGroupRequestDetailPage,
} from '@/features/group-requests'
import {
  AdminDashboardPage,
  AdminUsersPage,
  AdminUserDetailPage,
  AdminTeachersPage,
  AdminTeacherDetailPage,
  AdminTeacherCreatePage,
  AdminTeacherEditPage,
  AdminEnrollmentsPage,
  AdminEnrollmentDetailPage,
  AdminEnrollmentCreatePage,
  AdminEnrollmentChangeGroupPage,
  AdminPendingEnrollmentsPage,
  AdminGroupsPage,
  AdminGroupDetailPage,
  AdminGroupCreatePage,
  AdminGroupEditPage,
  AdminSubjectsPage,
  AdminSubjectDetailPage,
  AdminSubjectCreatePage,
  AdminSubjectEditPage,
  AdminGroupSchedulesPage,
  AdminSchedulesPage,
  AdminSessionsPage,
  AdminSessionDetailPage,
  AdminSessionGeneratePage,
  AdminPaymentsPage,
  AdminPaymentDetailPage,
  AdminPaymentGeneratePage,
} from '@/features/admin'
import { MainLayout } from '@/shared/components/layout'

function NotFoundPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-gray-600">Página no encontrada</p>
      </div>
    </div>
  )
}

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/verification-pending',
    element: <VerificationPendingPage />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmailPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },

  // Protected routes (student)
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <StudentDashboardPage />,
      },
      {
        path: 'enrollments',
        element: <EnrollmentsPage />,
      },
      {
        path: 'enrollments/:id',
        element: <EnrollmentDetailPage />,
      },
      {
        path: 'sessions',
        element: <SessionsPage />,
      },
      {
        path: 'sessions/:id',
        element: <SessionDetailPage />,
      },
      {
        path: 'attendance',
        element: <AttendanceHistoryPage />,
      },
      {
        path: 'payments',
        element: <PaymentsPage />,
      },
      {
        path: 'materials',
        element: <MaterialsPage />,
      },
      {
        path: 'subjects',
        element: <SubjectsPage />,
      },
      {
        path: 'subjects/:id',
        element: <SubjectDetailPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },

  // Admin routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute roles={['ADMIN']}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: 'users',
        element: <AdminUsersPage />,
      },
      {
        path: 'users/:id',
        element: <AdminUserDetailPage />,
      },
      {
        path: 'teachers',
        element: <AdminTeachersPage />,
      },
      {
        path: 'teachers/new',
        element: <AdminTeacherCreatePage />,
      },
      {
        path: 'teachers/:id',
        element: <AdminTeacherDetailPage />,
      },
      {
        path: 'teachers/:id/edit',
        element: <AdminTeacherEditPage />,
      },
      {
        path: 'enrollments',
        element: <AdminEnrollmentsPage />,
      },
      {
        path: 'enrollments/new',
        element: <AdminEnrollmentCreatePage />,
      },
      {
        path: 'enrollments/:id',
        element: <AdminEnrollmentDetailPage />,
      },
      {
        path: 'enrollments/:id/change-group',
        element: <AdminEnrollmentChangeGroupPage />,
      },
      {
        path: 'enrollments/pending',
        element: <AdminPendingEnrollmentsPage />,
      },
      {
        path: 'groups',
        element: <AdminGroupsPage />,
      },
      {
        path: 'groups/new',
        element: <AdminGroupCreatePage />,
      },
      {
        path: 'groups/:id',
        element: <AdminGroupDetailPage />,
      },
      {
        path: 'groups/:id/edit',
        element: <AdminGroupEditPage />,
      },
      {
        path: 'groups/:groupId/schedules',
        element: <AdminGroupSchedulesPage />,
      },
      {
        path: 'schedules',
        element: <AdminSchedulesPage />,
      },
      {
        path: 'sessions',
        element: <AdminSessionsPage />,
      },
      {
        path: 'sessions/generate',
        element: <AdminSessionGeneratePage />,
      },
      {
        path: 'sessions/:id',
        element: <AdminSessionDetailPage />,
      },
      {
        path: 'subjects',
        element: <AdminSubjectsPage />,
      },
      {
        path: 'subjects/new',
        element: <AdminSubjectCreatePage />,
      },
      {
        path: 'subjects/:id',
        element: <AdminSubjectDetailPage />,
      },
      {
        path: 'subjects/:id/edit',
        element: <AdminSubjectEditPage />,
      },
      {
        path: 'payments',
        element: <AdminPaymentsPage />,
      },
      {
        path: 'payments/generate',
        element: <AdminPaymentGeneratePage />,
      },
      {
        path: 'payments/:id',
        element: <AdminPaymentDetailPage />,
      },
      {
        path: 'group-requests',
        element: <AdminGroupRequestsPage />,
      },
      {
        path: 'group-requests/:id',
        element: <AdminGroupRequestDetailPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
