export type PaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'
export type PaymentType = 'INITIAL' | 'MONTHLY' | 'INTENSIVE_FULL'

export interface Payment {
  id: number
  enrollmentId: number
  studentId: number
  type: PaymentType
  status: PaymentStatus
  amount: number
  totalHours: number | null
  pricePerHour: number | null
  billingMonth: number | null
  billingYear: number | null
  generatedAt: string
  dueDate: string
  paidAt: string | null
  description: string | null
  isOverdue: boolean
  daysOverdue: number | null
  createdAt: string
  updatedAt: string
  // Enriched data from backend
  studentName: string
  subjectName: string
  subjectCode: string
}

export interface PaymentFilters {
  studentId?: number
  enrollmentId?: number
  status?: PaymentStatus
  type?: PaymentType
  billingMonth?: number
  billingYear?: number
  isOverdue?: boolean
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}
