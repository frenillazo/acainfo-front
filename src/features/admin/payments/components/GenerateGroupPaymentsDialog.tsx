import { useState, useEffect } from 'react'
import { CreditCard, Users, Clock, Euro } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { LoadingState } from '@/shared/components/common/LoadingState'
import {
  useGroupPaymentPreview,
  useGenerateGroupPayments,
} from '../hooks/useAdminPayments'

interface GenerateGroupPaymentsDialogProps {
  isOpen: boolean
  groupId: number
  onClose: () => void
  onSuccess: (count: number) => void
}

const MONTHS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
]

export function GenerateGroupPaymentsDialog({
  isOpen,
  groupId,
  onClose,
  onSuccess,
}: GenerateGroupPaymentsDialogProps) {
  const currentDate = new Date()
  const [billingMonth, setBillingMonth] = useState(currentDate.getMonth() + 1)
  const [billingYear, setBillingYear] = useState(currentDate.getFullYear())
  const [useCustomAmount, setUseCustomAmount] = useState(false)
  const [customAmount, setCustomAmount] = useState<string>('')

  const {
    data: preview,
    isLoading: isLoadingPreview,
    error: previewError,
  } = useGroupPaymentPreview(groupId, billingMonth, billingYear)

  const generateMutation = useGenerateGroupPayments()

  // Reset custom amount when preview changes
  useEffect(() => {
    if (preview) {
      setCustomAmount(preview.suggestedAmount.toFixed(2))
    }
  }, [preview])

  const handleGenerate = async () => {
    if (!preview) return

    try {
      const payments = await generateMutation.mutateAsync({
        groupId,
        billingMonth,
        billingYear,
        customAmount: useCustomAmount ? parseFloat(customAmount) : null,
      })
      onSuccess(payments.length)
      onClose()
    } catch (error) {
      console.error('Error generating payments:', error)
    }
  }

  if (!isOpen) return null

  const totalAmount = useCustomAmount
    ? parseFloat(customAmount) * (preview?.enrollments.length ?? 0)
    : preview?.enrollments.reduce((sum, e) => sum + e.individualAmount, 0) ?? 0

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Generar Pagos para el Grupo
                </h3>
                {preview && (
                  <p className="text-sm text-gray-500">
                    {preview.groupName} - {preview.subjectName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoadingPreview ? (
              <LoadingState />
            ) : previewError ? (
              <div className="rounded-md bg-red-50 p-4 text-red-700">
                Error al cargar la información del grupo
              </div>
            ) : preview ? (
              <div className="space-y-6">
                {/* Billing Period */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mes de facturación
                    </label>
                    <select
                      value={billingMonth}
                      onChange={(e) => setBillingMonth(parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {MONTHS.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Año
                    </label>
                    <input
                      type="number"
                      value={billingYear}
                      onChange={(e) => setBillingYear(parseInt(e.target.value))}
                      min={2020}
                      max={2100}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Euro className="h-4 w-4" />
                      <span>Precio/hora</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {preview.pricePerHour.toFixed(2)} €
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Horas totales</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {preview.totalHours.toFixed(1)} h
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>Inscripciones</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {preview.enrollments.length}
                    </p>
                  </div>
                </div>

                {/* Enrollments Table */}
                {preview.enrollments.length > 0 ? (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-700">
                      Pagos a generar
                    </h4>
                    <div className="max-h-48 overflow-y-auto rounded-md border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                              Estudiante
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                              Monto
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {preview.enrollments.map((enrollment) => (
                            <tr key={enrollment.enrollmentId}>
                              <td className="whitespace-nowrap px-4 py-2">
                                <div className="text-sm font-medium text-gray-900">
                                  {enrollment.studentName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {enrollment.studentEmail}
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-4 py-2 text-right text-sm text-gray-900">
                                {useCustomAmount
                                  ? `${parseFloat(customAmount).toFixed(2)} €`
                                  : `${enrollment.individualAmount.toFixed(2)} €`}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md bg-yellow-50 p-4 text-yellow-700">
                    No hay inscripciones activas para generar pagos
                  </div>
                )}

                {/* Custom Amount */}
                {preview.enrollments.length > 0 && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={useCustomAmount}
                        onChange={(e) => setUseCustomAmount(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Usar monto personalizado (igual para todos)
                      </span>
                    </label>
                    {useCustomAmount && (
                      <div className="mt-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            min={0}
                            step={0.01}
                            className="block w-32 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-500">€ por estudiante</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Total */}
                {preview.enrollments.length > 0 && (
                  <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
                    <span className="text-sm font-medium text-blue-700">
                      Total a generar ({preview.enrollments.length} pagos)
                    </span>
                    <span className="text-xl font-bold text-blue-900">
                      {totalAmount.toFixed(2)} €
                    </span>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={generateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleGenerate}
              isLoading={generateMutation.isPending}
              loadingText="Generando..."
              disabled={
                !preview ||
                preview.enrollments.length === 0 ||
                (useCustomAmount && (!customAmount || parseFloat(customAmount) <= 0))
              }
            >
              Generar Pagos
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
