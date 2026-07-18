import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('renderiza el título como h1', () => {
    render(<PageHeader title="Crear Curso" />)

    expect(screen.getByRole('heading', { level: 1, name: 'Crear Curso' })).toBeInTheDocument()
  })

  it('sin subtítulo no pinta el párrafo', () => {
    const { container } = render(<PageHeader title="Crear Curso" />)

    expect(container.querySelector('p')).toBeNull()
  })

  it('renderiza el subtítulo cuando se pasa', () => {
    render(<PageHeader title="Crear Curso" subtitle="Selecciona una asignatura" />)

    expect(screen.getByText('Selecciona una asignatura')).toBeInTheDocument()
  })

  it('renderiza las acciones junto al título', () => {
    render(
      <PageHeader
        title="Gestión de Profesores"
        actions={<button type="button">Crear profesor</button>}
      />
    )

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Crear profesor' })).toBeInTheDocument()
  })

  it('con acciones es responsive: apila en móvil (flex-col) y vuelve a fila en sm+', () => {
    const { container } = render(
      <PageHeader title="Sesiones" actions={<button type="button">Generar</button>} />
    )

    const wrapper = container.firstElementChild
    // En sm+ resuelve a `flex items-center justify-between` (escritorio intacto);
    // en móvil, flex-col apila título y acciones.
    expect(wrapper).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'sm:justify-between')
  })
})
