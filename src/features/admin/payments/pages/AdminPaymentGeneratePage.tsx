import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGeneratePayment, useGenerateMonthlyPayments } from '../hooks/useAdminPayments'
import { useAdminEnrollments } from '@/features/admin/enrollments/hooks/useAdminEnrollments'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { toast } from '@/shared/hooks/useToast'
import type { PaymentType } from '@/features/payments/types/payment.types'

export function AdminPaymentGeneratePage() {
  const [mode, setMode] = useState<'single' | 'monthly'>('single')

  // Student-subject selector state
  const [studentEmailInput, setStudentEmailInput] = useState('')
  const debouncedEmail = useDebounce(studentEmailInput, 400)
  const [enrollmentId, setEnrollmentId] = useState('')

  const [paymentType, setPaymentType] = useState<PaymentType>('MONTHLY')
  const [billingMonth, setBillingMonth] = useState('')
  const [billingYear, setBillingYear] = useState('')

  const generatePaymentMutation = useGeneratePayment()
  const generateMonthlyMutation = useGenerateMonthlyPayments()
  const { dialogProps, confirm } = useConfirmDialog()

  // Fetch active enrollments when email has enough characters
  const shouldSearch = debouncedEmail.length >= 3
  const { data: enrollmentsData, isLoading: isLoadingEnrollments } = useAdminEnrollments({
    studentEmail: shouldSearch ? debouncedEmail : undefined,
    status: 'ACTIVE',
    size: 50,
  })
  const enrollments = shouldSearch ? (enrollmentsData?.content ?? []) : []

  const currentYear = new Date().getFullYear()

  const handleStudentEmailChange = (value: string) => {
    setStudentEmailInput(value)
    // Reset enrollment selection when email changes
    setEnrollmentId('')
  }

  const handleGenerateSingle = (e: React.FormEvent) => {
    e.preventDefault()

    if (!enrollmentId || !billingMonth || !billingYear) {
      toast.warning('Por favor completa todos los campos')
      return
    }

    generatePaymentMutation.mutate(
      {
        enrollmentId: parseInt(enrollmentId, 10),
        type: paymentType,
        billingMonth: parseInt(billingMonth, 10),
        billingYear: parseInt(billingYear, 10),
      },
      {
        onSuccess: () => {
          toast.success('Pago generado exitosamente')
          setStudentEmailInput('')
          setEnrollmentId('')
          setBillingMonth('')
          setBillingYear('')
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'No se pudo generar el pago')
        },
      }
    )
  }

  const handleGenerateMonthly = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!billingMonth || !billingYear) {
      toast.warning('Por favor completa todos los campos')
      return
    }

    const confirmed = await confirm({
      title: 'Generar pagos mensuales',
      message: `¿Generar pagos mensuales para ${getMonthName(parseInt(billingMonth, 10))} ${billingYear}? Esto creará pagos para todas las inscripciones REGULARES activas.`,
      confirmLabel: 'Sí, generar pagos',
      variant: 'warning',
    })

    if (!confirmed) {
      return
    }

    generateMonthlyMutation.mutate(
      {
        billingMonth: parseInt(billingMonth, 10),
        billingYear: parseInt(billingYear, 10),
      },
      {
        onSuccess: (payments) => {
          toast.success(`${payments.length} pagos generados exitosamente`)
          setBillingMonth('')
          setBillingYear('')
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'No se pudieron generar los pagos')
        },
      }
    )
  }

  const getMonthName = (month: number) => {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ]
    return months[month - 1]
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        to="/admin/payments"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        ← Volver a pagos
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Generar Pagos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Genera pagos individuales o mensuales masivos
        </p>
      </div>

      {/* Mode Selector */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex gap-4">
          <button
            onClick={() => setMode('single')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium ${
              mode === 'single'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pago Individual
          </button>
          <button
            onClick={() => setMode('monthly')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium ${
              mode === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pagos Mensuales (Masivo)
          </button>
        </div>
      </div>

      {/* Single Payment Form */}
      {mode === 'single' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Generar Pago Individual
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            Genera un pago para una inscripción específica
          </p>

          <form onSubmit={handleGenerateSingle} className="space-y-4">
            {/* Step 1: Student email */}
            <div>
              <label
                htmlFor="studentEmail"
                className="block text-sm font-medium text-gray-700"
              >
                Email del Estudiante *
              </label>
              <input
                type="text"
                id="studentEmail"
                value={studentEmailInput}
                onChange={(e) => handleStudentEmailChange(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Escribe el email del estudiante..."
              />
              {studentEmailInput.length > 0 && studentEmailInput.length < 3 && (
                <p className="mt-1 text-xs text-gray-500">
                  Escribe al menos 3 caracteres para buscar
                </p>
              )}
              {isLoadingEnrollments && shouldSearch && (
                <p className="mt-1 text-xs text-blue-600">Buscando inscripciones...</p>
              )}
              {shouldSearch && !isLoadingEnrollments && enrollments.length === 0 && (
                <p className="mt-1 text-xs text-amber-600">
                  No se encontraron inscripciones activas para este email
                </p>
              )}
            </div>

            {/* Step 2: Enrollment selector */}
            <div>
              <label
                htmlFor="enrollmentSelect"
                className="block text-sm font-medium text-gray-700"
              >
                Inscripción (Asignatura - Grupo) *
              </label>
              <select
                id="enrollmentSelect"
                value={enrollmentId}
                onChange={(e) => setEnrollmentId(e.target.value)}
                disabled={enrollments.length === 0}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                required
              >
                <option value="">
                  {enrollments.length === 0
                    ? 'Primero busca un estudiante por email'
                    : 'Selecciona una inscripción'}
                </option>
                {enrollments.map((enrollment) => (
                  <option key={enrollment.id} value={enrollment.id}>
                    {enrollment.subjectName} - {enrollment.groupName}
                  </option>
                ))}
              </select>
              {enrollmentId && enrollments.length > 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  Estudiante: {enrollments.find((e) => e.id === parseInt(enrollmentId, 10))?.studentName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="paymentType"
                className="block text-sm font-medium text-gray-700"
              >
                Tipo de Pago *
              </label>
              <select
                id="paymentType"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="INITIAL">Inicial</option>
                <option value="MONTHLY">Mensual</option>
                <option value="INTENSIVE_FULL">Intensivo Completo</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="billingMonth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mes de Facturación *
                </label>
                <select
                  id="billingMonth"
                  value={billingMonth}
                  onChange={(e) => setBillingMonth(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona un mes</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {getMonthName(month)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="billingYear"
                  className="block text-sm font-medium text-gray-700"
                >
                  Año de Facturación *
                </label>
                <input
                  type="number"
                  id="billingYear"
                  value={billingYear}
                  onChange={(e) => setBillingYear(e.target.value)}
                  min="2020"
                  max={currentYear + 1}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={currentYear.toString()}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link
                to="/admin/payments"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={generatePaymentMutation.isPending}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {generatePaymentMutation.isPending ? 'Generando...' : 'Generar Pago'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Monthly Payments Form */}
      {mode === 'monthly' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Generar Pagos Mensuales (Masivo)
          </h2>
          <div className="mb-6 rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  Esta acción generará pagos para <strong>todas las inscripciones REGULARES activas</strong>.
                  Normalmente se ejecuta automáticamente el día 1 de cada mes.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleGenerateMonthly} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="monthlyBillingMonth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mes de Facturación *
                </label>
                <select
                  id="monthlyBillingMonth"
                  value={billingMonth}
                  onChange={(e) => setBillingMonth(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona un mes</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {getMonthName(month)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="monthlyBillingYear"
                  className="block text-sm font-medium text-gray-700"
                >
                  Año de Facturación *
                </label>
                <input
                  type="number"
                  id="monthlyBillingYear"
                  value={billingYear}
                  onChange={(e) => setBillingYear(e.target.value)}
                  min="2020"
                  max={currentYear + 1}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={currentYear.toString()}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link
                to="/admin/payments"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={generateMonthlyMutation.isPending}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {generateMonthlyMutation.isPending
                  ? 'Generando...'
                  : 'Generar Pagos Mensuales'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog {...dialogProps} isLoading={generateMonthlyMutation.isPending} />
    </div>
  )
}
