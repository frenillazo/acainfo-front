import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminMaterialGeneratePage } from './AdminMaterialGeneratePage'
import type { MaterialAiJob } from '@/features/materials/types/material.types'

vi.mock('../hooks/useAdminSubjects', () => ({
  useAdminSubject: () => ({ data: { id: 30, name: 'Cálculo I' } }),
}))

vi.mock('@/features/materials/services/materialFolderApi', () => ({
  materialFolderApi: { getBySubjectId: vi.fn(async () => []) },
}))

const generateMock = vi.fn()
const getJobMock = vi.fn()
vi.mock('@/features/materials/services/materialAiApi', () => ({
  materialAiApi: {
    generate: (...args: unknown[]) => generateMock(...args),
    getJob: (...args: unknown[]) => getJobMock(...args),
    transcribe: vi.fn(),
  },
}))

afterEach(() => {
  cleanup()
  generateMock.mockReset()
  getJobMock.mockReset()
})

function job(status: MaterialAiJob['status'], errorMessage: string | null = null): MaterialAiJob {
  return {
    id: 40,
    type: 'GENERATE',
    subjectId: 30,
    sourceMaterialId: null,
    status,
    errorMessage,
    resultMaterialId: status === 'COMPLETED' ? 55 : null,
    createdAt: '2026-07-15T10:00:00',
    updatedAt: '2026-07-15T10:00:00',
  }
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/admin/subjects/30/materials/generate']}>
        <Routes>
          <Route
            path="/admin/subjects/:id/materials/generate"
            element={<AdminMaterialGeneratePage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

function addImageAndSubmit(container: HTMLElement) {
  const input = container.querySelector<HTMLInputElement>('#multi-file-upload')!
  fireEvent.change(input, {
    target: { files: [new File([new Uint8Array([1, 2, 3])], 'captura.png', { type: 'image/png' })] },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Generar ejercicios' }))
}

describe('AdminMaterialGeneratePage', () => {
  it('renderiza el formulario y no deja generar sin capturas', () => {
    renderPage()

    expect(screen.getByText('Generar ejercicios con IA')).toBeInTheDocument()
    expect(screen.getByText('Capturas de la clase')).toBeInTheDocument()
    expect(screen.getByLabelText('Carpeta')).toBeInTheDocument()
    expect(screen.getByLabelText('Número de ejercicios')).toHaveValue(2)
    expect(screen.getByRole('button', { name: 'Generar ejercicios' })).toBeDisabled()
  })

  it('lanza el job tras confirmar y muestra el resultado cuando el polling llega a COMPLETED', async () => {
    generateMock.mockResolvedValue(job('PENDING'))
    getJobMock.mockResolvedValue(job('COMPLETED'))

    const { container } = renderPage()
    addImageAndSubmit(container)

    // Confirmación previa al gasto
    expect(await screen.findByText(/Se generarán 2 ejercicio/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Sí, generar' }))

    await waitFor(() => expect(generateMock).toHaveBeenCalledTimes(1))
    expect(generateMock.mock.calls[0][0]).toEqual({
      subjectId: 30,
      folderId: null,
      exerciseCount: 2,
    })

    // El polling consulta el job y la página refleja el estado terminal
    expect(await screen.findByText('Material publicado')).toBeInTheDocument()
    expect(getJobMock).toHaveBeenCalledWith(40)
  })

  it('con un job FAILED muestra el error del back y permite relanzar creando un job nuevo', async () => {
    generateMock.mockResolvedValue(job('PENDING'))
    getJobMock.mockResolvedValue(job('FAILED', 'El documento no compila tras 2 correcciones'))

    const { container } = renderPage()
    addImageAndSubmit(container)
    fireEvent.click(await screen.findByRole('button', { name: 'Sí, generar' }))

    expect(await screen.findByText('La generación falló')).toBeInTheDocument()
    expect(screen.getByText('El documento no compila tras 2 correcciones')).toBeInTheDocument()

    // Relanzar re-envía la petición original (job NUEVO, sin retry server-side)
    fireEvent.click(screen.getByRole('button', { name: 'Relanzar con las mismas capturas' }))
    await waitFor(() => expect(generateMock).toHaveBeenCalledTimes(2))
  })
})
