import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PendingEnrollmentCard } from './PendingEnrollmentCard'
import { enrollmentApi } from '../services/enrollmentApi'
import { toast } from '@/shared/hooks/useToast'
import type { Enrollment } from '../types/enrollment.types'

vi.mock('../services/enrollmentApi', () => ({
  enrollmentApi: { approve: vi.fn(), reject: vi.fn() },
}))

afterEach(cleanup)

const enrollment = {
  id: 41,
  studentId: 3,
  courseId: 2,
  status: 'PENDING_APPROVAL',
  waitingListPosition: null,
  enrolledAt: '2026-07-16T10:20:00',
  studentName: 'Laura Martínez',
  studentEmail: 'alumno01@mail.com',
  subjectId: 2,
  subjectName: 'Bases de Datos',
  subjectCode: 'INF201',
  courseName: 'Bases de Datos grupo 1 25-26',
  teacherName: 'María García',
  scheduleSummary: 'M 16:00-18:00',
  courseCapacity: 24,
  currentEnrollmentCount: 7,
} as Enrollment

const renderCard = (props: Partial<Parameters<typeof PendingEnrollmentCard>[0]> = {}) => {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <PendingEnrollmentCard enrollment={enrollment} {...props} />
    </QueryClientProvider>
  )
}

describe('PendingEnrollmentCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra la ocupación del curso: es el dato de la decisión', () => {
    renderCard()

    expect(screen.getByText('7 / 24 inscritos')).toBeInTheDocument()
  })

  it('avisa de que aprobar en un curso completo manda a lista de espera', () => {
    renderCard({
      enrollment: { ...enrollment, currentEnrollmentCount: 24 },
    })

    expect(screen.getByText(/24 \/ 24 inscritos — completo/)).toBeInTheDocument()
    expect(screen.getByText('Si apruebas, entrará en lista de espera.')).toBeInTheDocument()
  })

  it('indica cuántas solicitudes compiten por el mismo curso', () => {
    renderCard({ pendingForSameCourse: 3 })

    expect(screen.getByText('3 solicitudes pendientes para este curso')).toBeInTheDocument()
  })

  it('al aprobar avisa de que el alumno quedó en lista de espera, no activo', async () => {
    // El back decide ACTIVE vs WAITING_LIST al aprobar; sin mirar el resultado,
    // la card desaparecía y el admin daba por hecho que quedaba inscrito.
    const toastSpy = vi.spyOn(toast, 'warning')
    vi.mocked(enrollmentApi.approve).mockResolvedValue({
      ...enrollment,
      status: 'WAITING_LIST',
      waitingListPosition: 2,
    } as Enrollment)

    renderCard()
    fireEvent.click(screen.getByRole('button', { name: 'Aprobar' }))

    await waitFor(() =>
      expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining('lista de espera'))
    )
    expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining('posición 2'))
  })

  it('al aprobar con plaza confirma que la inscripción queda activa', async () => {
    const toastSpy = vi.spyOn(toast, 'success')
    vi.mocked(enrollmentApi.approve).mockResolvedValue({
      ...enrollment,
      status: 'ACTIVE',
    } as Enrollment)

    renderCard()
    fireEvent.click(screen.getByRole('button', { name: 'Aprobar' }))

    await waitFor(() =>
      expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining('inscripción activa'))
    )
  })
})
