import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MaterialUploadForm } from './MaterialUploadForm'

vi.mock('../services/materialFolderApi', () => ({
  materialFolderApi: { getBySubjectId: vi.fn(async () => []) },
}))

afterEach(cleanup)

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('MaterialUploadForm', () => {
  it('sin subjectId fijo monta el select de asignatura con las opciones dadas', () => {
    renderWithQuery(
      <MaterialUploadForm
        subjects={[
          { id: 1, name: 'Cálculo I' },
          { id: 2, name: 'Álgebra' },
        ]}
        onSubmit={vi.fn()}
      />
    )

    expect(screen.getByLabelText('Asignatura')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Cálculo I' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Álgebra' })).toBeInTheDocument()
  })

  it('el select de asignatura se monta aunque la lista aún no haya llegado (antes fallaba en silencio)', () => {
    const { container } = renderWithQuery(<MaterialUploadForm subjects={[]} onSubmit={vi.fn()} />)

    expect(screen.getByLabelText('Asignatura')).toBeInTheDocument()

    // Al enviar sin asignatura, el error de validación tiene dónde mostrarse
    fireEvent.submit(container.querySelector('form')!)
    expect(screen.getByText('Selecciona una asignatura')).toBeInTheDocument()
  })

  it('con subjectId fijo no muestra el select de asignatura', () => {
    renderWithQuery(<MaterialUploadForm subjectId={5} onSubmit={vi.fn()} />)

    expect(screen.queryByLabelText('Asignatura')).toBeNull()
  })
})
