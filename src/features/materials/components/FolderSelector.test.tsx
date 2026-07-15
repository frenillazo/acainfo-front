import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FolderSelector } from './FolderSelector'
import type { MaterialFolder } from '../types/material.types'

vi.mock('../services/materialFolderApi', () => ({
  materialFolderApi: {
    getBySubjectId: vi.fn(async (): Promise<MaterialFolder[]> => [
      {
        id: 1,
        subjectId: 10,
        name: 'Teoría',
        position: 0,
        createdAt: '2026-07-01T10:00:00',
        updatedAt: '2026-07-01T10:00:00',
      },
      {
        id: 2,
        subjectId: 10,
        name: 'Prácticas',
        position: 1,
        createdAt: '2026-07-01T10:00:00',
        updatedAt: '2026-07-01T10:00:00',
      },
    ]),
  },
}))

afterEach(cleanup)

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('FolderSelector', () => {
  it('sin asignatura queda deshabilitado y lo explica', () => {
    renderWithQuery(<FolderSelector value={null} onChange={() => {}} />)

    expect(screen.getByLabelText('Carpeta')).toBeDisabled()
    expect(screen.getByText('Selecciona primero una asignatura')).toBeInTheDocument()
  })

  it('con asignatura carga sus carpetas y ofrece "Sin carpeta" como primera opción', async () => {
    renderWithQuery(<FolderSelector subjectId={10} value={null} onChange={() => {}} />)

    expect(
      await screen.findByRole('option', { name: 'Teoría' })
    ).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Prácticas' })).toBeInTheDocument()

    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveTextContent('Sin carpeta (raíz de la asignatura)')
    expect(screen.getByLabelText('Carpeta')).toBeEnabled()
  })

  it('emite el id numérico de la carpeta elegida y null para "Sin carpeta"', async () => {
    const onChange = vi.fn()
    renderWithQuery(<FolderSelector subjectId={10} value={null} onChange={onChange} />)

    const select = await screen.findByLabelText('Carpeta')
    await screen.findByRole('option', { name: 'Teoría' })

    fireEvent.change(select, { target: { value: '1' } })
    expect(onChange).toHaveBeenLastCalledWith(1)

    fireEvent.change(select, { target: { value: '' } })
    expect(onChange).toHaveBeenLastCalledWith(null)
  })
})
