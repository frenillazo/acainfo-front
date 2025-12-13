import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute, LoginPage, RegisterPage } from '@/features/auth'
import { MainLayout } from '@/shared/components/layout'

// Lazy load pages for code splitting
// import { lazy } from 'react'
// const StudentDashboardPage = lazy(() => import('@/features/student/pages/StudentDashboardPage'))

// Placeholder components until we create the actual pages
function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">Bienvenido a AcaInfo</p>
    </div>
  )
}

function EnrollmentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Mis Inscripciones</h1>
    </div>
  )
}

function SessionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Sesiones</h1>
    </div>
  )
}

function PaymentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Pagos</h1>
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

function SubjectsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Asignaturas</h1>
    </div>
  )
}

function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
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
        element: <DashboardPage />,
      },
      {
        path: 'enrollments',
        element: <EnrollmentsPage />,
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
    ],
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
