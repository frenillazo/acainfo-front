import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CourseCard } from './CourseCard'
import type { Course } from '../types/subject.types'

afterEach(cleanup)

const baseCourse: Course = {
  id: 1,
  name: 'Programación I grupo 1 25-26',
  subjectId: 10,
  teacherId: 2,
  status: 'OPEN',
  currentEnrollmentCount: 7,
  capacity: 24,
  availableSeats: 17,
  pricePerMonth: 120,
  startDate: '2026-07-16',
  endDate: '2026-11-16',
  subjectName: 'Programación I',
  subjectCode: 'INF101',
  teacherName: 'María García',
  createdAt: '2026-07-16T10:00:00',
  updatedAt: '2026-07-16T10:00:00',
  isOpen: true,
  canEnroll: true,
  schedules: [],
}

/** Curso lleno tal y como lo devuelve el back: sin plazas, canEnroll a false. */
const fullCourse: Course = {
  ...baseCourse,
  currentEnrollmentCount: 24,
  availableSeats: 0,
  canEnroll: false,
}

const renderCard = (props: Partial<Parameters<typeof CourseCard>[0]> = {}) =>
  render(
    <MemoryRouter>
      <CourseCard course={baseCourse} {...props} />
    </MemoryRouter>
  )

describe('CourseCard', () => {
  it('ofrece solicitar plaza cuando hay hueco', () => {
    renderCard({ onEnroll: vi.fn() })

    expect(screen.getByRole('button', { name: 'Solicitar inscripción' })).toBeEnabled()
  })

  it('con el curso lleno ofrece la lista de espera en vez de esconder el botón', () => {
    // El back acepta la solicitud aunque no haya plaza (la aprobación decide
    // ACTIVE vs WAITING_LIST), pero `canEnroll` es false: usarlo para pintar el
    // botón dejaba al alumno sin ninguna salida ante un curso completo.
    const onEnroll = vi.fn()
    renderCard({ course: fullCourse, onEnroll })

    const button = screen.getByRole('button', { name: 'Unirme a la lista de espera' })
    expect(button).toBeEnabled()

    fireEvent.click(button)
    expect(onEnroll).toHaveBeenCalledWith(fullCourse)
  })

  it('explica qué implica la lista de espera antes de pulsar', () => {
    renderCard({ course: fullCourse, onEnroll: vi.fn() })

    expect(screen.getByText(/entrarás en lista de espera/i)).toBeInTheDocument()
  })

  it('con solicitud pendiente enlaza a su detalle en vez de ofrecer el botón', () => {
    renderCard({ onEnroll: vi.fn(), pendingEnrollmentId: 41 })

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /solicitud enviada/i })).toHaveAttribute(
      'href',
      '/dashboard/enrollments/41'
    )
  })

  it('no ofrece solicitar plaza si el curso está cerrado', () => {
    renderCard({ course: { ...baseCourse, isOpen: false }, onEnroll: vi.fn() })

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByText('Inscripciones cerradas')).toBeInTheDocument()
  })
})
