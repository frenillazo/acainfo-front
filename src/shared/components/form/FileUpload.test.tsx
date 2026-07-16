import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { FileUpload, DEFAULT_MAX_FILE_SIZE } from './FileUpload'

afterEach(cleanup)

function file(name: string, sizeBytes: number, type = 'application/pdf'): File {
  const f = new File(['x'], name, { type })
  Object.defineProperty(f, 'size', { value: sizeBytes })
  return f
}

/** Soltar un fichero por drag&drop (el camino que no validaba nada). */
function drop(target: Element, f: File) {
  fireEvent.drop(target, { dataTransfer: { files: [f] } })
}

describe('FileUpload', () => {
  it('acepta un archivo dentro del límite', () => {
    const onChange = vi.fn()
    render(<FileUpload value={null} onChange={onChange} />)

    const pequeño = file('apuntes.pdf', 1024)
    drop(screen.getByText(/arrástralo aquí/i).closest('div')!, pequeño)

    expect(onChange).toHaveBeenCalledWith(pequeño)
  })

  it('rechaza un archivo demasiado grande DICIÉNDOLO (antes fallaba en silencio)', () => {
    const onChange = vi.fn()
    render(<FileUpload value={null} onChange={onChange} />)

    drop(
      screen.getByText(/arrástralo aquí/i).closest('div')!,
      file('pizarra.pdf', DEFAULT_MAX_FILE_SIZE + 1)
    )

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(/máximo/i)
  })

  it('rechaza un tipo que no está en accept, también por arrastre', () => {
    // El drop no miraba `accept`: por arrastre entraba cualquier cosa.
    const onChange = vi.fn()
    render(<FileUpload value={null} onChange={onChange} accept="application/pdf" />)

    drop(
      screen.getByText(/arrástralo aquí/i).closest('div')!,
      file('foto.png', 1024, 'image/png')
    )

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(/no se admite/i)
  })

  it('acepta por extensión cuando accept usa ".pdf"', () => {
    const onChange = vi.fn()
    render(<FileUpload value={null} onChange={onChange} accept=".pdf" />)

    const pdf = file('examen.pdf', 2048, '')
    drop(screen.getByText(/arrástralo aquí/i).closest('div')!, pdf)

    expect(onChange).toHaveBeenCalledWith(pdf)
  })

  it('anuncia el límite antes de que el usuario falle', () => {
    render(<FileUpload value={null} onChange={vi.fn()} />)

    expect(screen.getByText(/hasta 20 MB/i)).toBeInTheDocument()
  })
})
