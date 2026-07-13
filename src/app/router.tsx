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
import { TermsPage } from '@/features/legal'
import { MainLayout } from '@/shared/components/layout'
import { NotFoundPage } from './NotFoundPage'

/**
 * Helper to create a lazy route from a module with a named export.
 * Uses React Router's built-in `lazy` for automatic code splitting.
 */
function lazyPage(importFn: () => Promise<Record<string, unknown>>, exportName: string) {
  return {
    lazy: () => importFn().then((m) => ({ Component: m[exportName] as React.ComponentType })),
  }
}

export const router = createBrowserRouter([
  // Public routes (eagerly loaded — needed immediately)
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
  {
    path: '/terminos',
    element: <TermsPage />,
  },

  // Protected routes (student) — lazy loaded
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
        ...lazyPage(() => import('@/features/student'), 'StudentDashboardPage'),
      },
      {
        path: 'enrollments',
        ...lazyPage(() => import('@/features/enrollments'), 'EnrollmentsPage'),
      },
      {
        path: 'enrollments/:id',
        ...lazyPage(() => import('@/features/enrollments'), 'EnrollmentDetailPage'),
      },
      {
        path: 'sessions',
        ...lazyPage(() => import('@/features/sessions'), 'SessionsPage'),
      },
      {
        path: 'sessions/:id',
        ...lazyPage(() => import('@/features/sessions'), 'SessionDetailPage'),
      },
      {
        path: 'materials',
        ...lazyPage(() => import('@/features/materials'), 'MaterialsPage'),
      },
      {
        path: 'subjects',
        ...lazyPage(() => import('@/features/subjects'), 'SubjectsPage'),
      },
      {
        path: 'subjects/:id',
        ...lazyPage(() => import('@/features/subjects'), 'SubjectDetailPage'),
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },

  // Admin routes — lazy loaded
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
        ...lazyPage(() => import('@/features/admin/pages/AdminDashboardPage'), 'AdminDashboardPage'),
      },
      {
        path: 'users',
        ...lazyPage(() => import('@/features/admin/users/pages/AdminUsersPage'), 'AdminUsersPage'),
      },
      {
        path: 'users/:id',
        ...lazyPage(() => import('@/features/admin/users/pages/AdminUserDetailPage'), 'AdminUserDetailPage'),
      },
      {
        path: 'teachers',
        ...lazyPage(() => import('@/features/admin/teachers/pages/AdminTeachersPage'), 'AdminTeachersPage'),
      },
      {
        path: 'teachers/new',
        ...lazyPage(() => import('@/features/admin/teachers/pages/AdminTeacherCreatePage'), 'AdminTeacherCreatePage'),
      },
      {
        path: 'teachers/:id',
        ...lazyPage(() => import('@/features/admin/teachers/pages/AdminTeacherDetailPage'), 'AdminTeacherDetailPage'),
      },
      {
        path: 'teachers/:id/edit',
        ...lazyPage(() => import('@/features/admin/teachers/pages/AdminTeacherEditPage'), 'AdminTeacherEditPage'),
      },
      {
        path: 'enrollments',
        ...lazyPage(() => import('@/features/admin/enrollments/pages/AdminEnrollmentsPage'), 'AdminEnrollmentsPage'),
      },
      {
        path: 'enrollments/new',
        ...lazyPage(() => import('@/features/admin/enrollments/pages/AdminEnrollmentCreatePage'), 'AdminEnrollmentCreatePage'),
      },
      {
        path: 'enrollments/:id',
        ...lazyPage(() => import('@/features/admin/enrollments/pages/AdminEnrollmentDetailPage'), 'AdminEnrollmentDetailPage'),
      },
      {
        path: 'enrollments/:id/change-course',
        ...lazyPage(() => import('@/features/admin/enrollments/pages/AdminEnrollmentChangeCoursePage'), 'AdminEnrollmentChangeCoursePage'),
      },
      {
        path: 'enrollments/pending',
        ...lazyPage(() => import('@/features/admin/enrollments/pages/AdminPendingEnrollmentsPage'), 'AdminPendingEnrollmentsPage'),
      },
      {
        path: 'courses',
        ...lazyPage(() => import('@/features/admin/courses/pages/AdminCoursesPage'), 'AdminCoursesPage'),
      },
      {
        path: 'courses/new',
        ...lazyPage(() => import('@/features/admin/courses/pages/AdminCourseCreatePage'), 'AdminCourseCreatePage'),
      },
      {
        path: 'courses/:id',
        ...lazyPage(() => import('@/features/admin/courses/pages/AdminCourseDetailPage'), 'AdminCourseDetailPage'),
      },
      {
        path: 'courses/:id/edit',
        ...lazyPage(() => import('@/features/admin/courses/pages/AdminCourseEditPage'), 'AdminCourseEditPage'),
      },
      {
        path: 'courses/:courseId/schedules',
        ...lazyPage(() => import('@/features/admin/schedules/pages/AdminCourseSchedulesPage'), 'AdminCourseSchedulesPage'),
      },
      {
        path: 'schedules',
        ...lazyPage(() => import('@/features/admin/schedules/pages/AdminSchedulesPage'), 'AdminSchedulesPage'),
      },
      {
        path: 'sessions',
        ...lazyPage(() => import('@/features/admin/sessions/pages/AdminSessionsPage'), 'AdminSessionsPage'),
      },
      {
        path: 'sessions/generate',
        ...lazyPage(() => import('@/features/admin/sessions/pages/AdminSessionGeneratePage'), 'AdminSessionGeneratePage'),
      },
      {
        path: 'sessions/:id',
        ...lazyPage(() => import('@/features/admin/sessions/pages/AdminSessionDetailPage'), 'AdminSessionDetailPage'),
      },
      {
        path: 'subjects',
        ...lazyPage(() => import('@/features/admin/subjects/pages/AdminSubjectsPage'), 'AdminSubjectsPage'),
      },
      {
        path: 'subjects/new',
        ...lazyPage(() => import('@/features/admin/subjects/pages/AdminSubjectCreatePage'), 'AdminSubjectCreatePage'),
      },
      {
        path: 'subjects/:id',
        ...lazyPage(() => import('@/features/admin/subjects/pages/AdminSubjectDetailPage'), 'AdminSubjectDetailPage'),
      },
      {
        path: 'subjects/:id/edit',
        ...lazyPage(() => import('@/features/admin/subjects/pages/AdminSubjectEditPage'), 'AdminSubjectEditPage'),
      },
      {
        path: 'demand',
        ...lazyPage(() => import('@/features/admin/pages/AdminDemandPage'), 'AdminDemandPage'),
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
