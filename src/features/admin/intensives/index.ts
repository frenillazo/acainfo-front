// Pages
export { AdminIntensivesPage } from './pages/AdminIntensivesPage'
export { AdminIntensiveCreatePage } from './pages/AdminIntensiveCreatePage'
export { AdminIntensiveDetailPage } from './pages/AdminIntensiveDetailPage'
export { AdminIntensiveEditPage } from './pages/AdminIntensiveEditPage'

// Components
export { IntensiveTable } from './components/IntensiveTable'
export { IntensiveForm } from './components/IntensiveForm'
export { IntensiveSessionList } from './components/IntensiveSessionList'
export { IntensiveSessionBulkForm } from './components/IntensiveSessionBulkForm'

// Hooks
export {
  useAdminIntensives,
  useAdminIntensive,
  useIntensiveSessions,
  useCreateIntensive,
  useUpdateIntensive,
  useDeleteIntensive,
  useCancelIntensive,
  useCreateIntensiveSessionsBulk,
  useCreateIntensiveSession,
} from './hooks/useAdminIntensives'

// Types
export type {
  Intensive,
  IntensiveStatus,
  CreateIntensiveRequest,
  UpdateIntensiveRequest,
  IntensiveFilters,
  IntensiveSessionEntry,
} from './types/intensive.types'
