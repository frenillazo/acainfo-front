// Pages
export { AdminDashboardPage } from './pages/AdminDashboardPage'
export { AdminUsersPage } from './users/pages/AdminUsersPage'
export { AdminUserDetailPage } from './users/pages/AdminUserDetailPage'
export { AdminTeachersPage } from './teachers/pages/AdminTeachersPage'
export { AdminTeacherDetailPage } from './teachers/pages/AdminTeacherDetailPage'
export { AdminTeacherCreatePage } from './teachers/pages/AdminTeacherCreatePage'
export { AdminTeacherEditPage } from './teachers/pages/AdminTeacherEditPage'
export { AdminEnrollmentsPage } from './enrollments/pages/AdminEnrollmentsPage'
export { AdminEnrollmentDetailPage } from './enrollments/pages/AdminEnrollmentDetailPage'
export { AdminEnrollmentCreatePage } from './enrollments/pages/AdminEnrollmentCreatePage'
export { AdminEnrollmentChangeGroupPage } from './enrollments/pages/AdminEnrollmentChangeGroupPage'
export { AdminGroupsPage } from './groups/pages/AdminGroupsPage'
export { AdminGroupDetailPage } from './groups/pages/AdminGroupDetailPage'
export { AdminGroupCreatePage } from './groups/pages/AdminGroupCreatePage'
export { AdminGroupEditPage } from './groups/pages/AdminGroupEditPage'

// Components
export { StatCard } from './components/StatCard'
export { QuickActionCard } from './components/QuickActionCard'

// Hooks
export { useAdminDashboardStats, useUsers, useTeachers } from './hooks/useAdminDashboard'

// Services
export { adminApi } from './services/adminApi'

// Types
export type {
  User,
  Teacher,
  UserFilters,
  TeacherFilters,
  AdminDashboardStats,
  UserStatus,
  RoleType,
} from './types/admin.types'
