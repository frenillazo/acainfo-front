import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SubjectForm } from './SubjectForm'
import type { Subject } from '../../types/admin.types'

const subject: Subject = {
  id: 1,
  code: 'ING101',
  name: 'Programación I',
  displayName: 'ING101 - Programación I',
  degree: 'INGENIERIA_INFORMATICA',
  year: 2,
  status: 'ACTIVE',
  currentGroupCount: 0,
  active: true,
  archived: false,
  canCreateGroup: true,
  createdAt: '2026-01-01T00:00:00',
  updatedAt: '2026-01-01T00:00:00',
}

describe('SubjectForm en modo edición', () => {
  it('permite guardar con curso "Sin asignar" y emite year null', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<SubjectForm subject={subject} onSubmit={onSubmit} />)

    await user.selectOptions(
      screen.getByLabelText('Curso'),
      screen.getByRole('option', { name: 'Sin asignar' })
    )
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      name: 'Programación I',
      year: null,
    })
  })

  it('emite year numérico al seleccionar un curso', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<SubjectForm subject={subject} onSubmit={onSubmit} />)

    await user.selectOptions(
      screen.getByLabelText('Curso'),
      screen.getByRole('option', { name: '3º Curso' })
    )
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ year: 3 })
  })
})

describe('SubjectForm en modo creación', () => {
  it('permite crear con curso "Sin asignar" y emite year undefined', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<SubjectForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Código'), 'ING101')
    await user.type(screen.getByLabelText('Nombre'), 'Programación I')
    await user.selectOptions(
      screen.getByLabelText('Grado'),
      screen.getByRole('option', { name: 'Ingeniería Informática' })
    )
    await user.click(screen.getByRole('button', { name: 'Crear asignatura' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit.mock.calls[0][0].year).toBeUndefined()
  })
})
