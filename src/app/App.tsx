import { RouterProvider } from 'react-router-dom'
import { AppProviders } from './providers'
import { router } from './router'
import { ErrorBoundary } from '@/shared/components/common'
import { ToastContainer } from '@/shared/components/ui/ToastContainer'

export function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
        <ToastContainer />
      </AppProviders>
    </ErrorBoundary>
  )
}
