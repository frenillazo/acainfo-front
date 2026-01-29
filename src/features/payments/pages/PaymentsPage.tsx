import { useState } from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { usePayments } from '../hooks/usePayments'
import { PaymentCard } from '../components/PaymentCard'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import type { Payment, PaymentStatus } from '../types/payment.types'
import { cn } from '@/shared/utils/cn'

type FilterTab = 'all' | 'pending' | 'paid'

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'paid', label: 'Pagados' },
]

export function PaymentsPage() {
  const user = useAuthStore((state) => state.user)
  const [activeTab, setActiveTab] = useState<FilterTab>('pending')

  const { data: payments, isLoading, error } = usePayments(user?.id ?? 0)

  const filteredPayments = payments?.filter((payment) => {
    if (activeTab === 'all') return true
    if (activeTab === 'pending') return payment.status === 'PENDING' || payment.isOverdue
    if (activeTab === 'paid') return payment.status === 'PAID'
    return true
  })

  const overduePayments = payments?.filter((p) => p.isOverdue) ?? []
  const pendingPayments = payments?.filter((p) => p.status === 'PENDING' && !p.isOverdue) ?? []

  const handlePayClick = (payment: Payment) => {
    // TODO: Integrate with payment gateway (Stripe)
    console.log('Pay clicked:', payment.id)
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} title="Error al cargar los pagos" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mis Pagos</h1>
      </div>

      {overduePayments.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <p className="font-medium text-red-800">
              Tienes {overduePayments.length} pago{overduePayments.length > 1 ? 's' : ''} vencido
              {overduePayments.length > 1 ? 's' : ''}
            </p>
          </div>
          <p className="mt-1 text-sm text-red-700">
            El acceso a materiales puede estar restringido hasta regularizar los pagos.
          </p>
        </div>
      )}

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-4">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'border-b-2 px-1 py-3 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              )}
            >
              {tab.label}
              {tab.key === 'pending' && pendingPayments.length + overduePayments.length > 0 && (
                <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                  {pendingPayments.length + overduePayments.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {filteredPayments && filteredPayments.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPayments.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} onPayClick={handlePayClick} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-500">
            {activeTab === 'pending'
              ? 'No tienes pagos pendientes'
              : activeTab === 'paid'
                ? 'No tienes pagos realizados'
                : 'No tienes pagos registrados'}
          </p>
        </div>
      )}
    </div>
  )
}
