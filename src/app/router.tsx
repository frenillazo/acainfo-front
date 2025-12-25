import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute, LoginPage, RegisterPage } from '@/features/auth'
import { StudentDashboardPage } from '@/features/student'
import { EnrollmentsPage, EnrollmentDetailPage } from '@/features/enrollments'
import { PaymentsPage } from '@/features/payments'
import { SubjectsPage, SubjectDetailPage } from '@/features/subjects'
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
  AdminGroupsPage,
  AdminGroupDetailPage,
  AdminGroupCreatePage,
  AdminGroupEditPage,
} from '@/features/admin'
import { MainLayout } from '@/shared/components/layout'

function SessionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Sesiones</h1>
    </div>
  )
}

function MaterialsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Materiales</h1>
    </div>
  )
}

// Admin placeholder pages
function AdminPaymentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Gestion de Pagos</h1>
      <p className="mt-2 text-gray-600">Proximamente...</p>
    </div>
  )
}

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
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  // Protected routes (student)
  {
    path: '/',
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
        path: 'payments',
        element: <AdminPaymentsPage />,
      },
    ],
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
