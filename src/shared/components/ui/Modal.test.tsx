import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import { Modal } from './Modal'

afterEach(cleanup)

/** Escenario real: un botón de la página abre el modal. */
function PageWithModal({ closeOnEscape = true }: { closeOnEscape?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Abrir</button>
      <a href="/otra-pagina">Enlace del fondo</a>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Título" closeOnEscape={closeOnEscape}>
        <button>Primero</button>
        <button>Segundo</button>
      </Modal>
    </>
  )
}

describe('Modal: gestión del foco', () => {
  it('al abrir, el foco entra en el diálogo (antes se quedaba en el botón que lo abrió)', () => {
    render(<PageWithModal />)
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }))

    // El primer enfocable del panel es la X de cerrar.
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cerrar' }))
  })

  it('al cerrar, el foco vuelve a quien abrió el modal', () => {
    render(<PageWithModal />)
    const trigger = screen.getByRole('button', { name: 'Abrir' })
    // fireEvent.click no mueve el foco (un navegador real sí al pulsar un
    // botón), así que se enfoca a mano para reproducir el escenario.
    trigger.focus()
    fireEvent.click(trigger)

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(document.activeElement).toBe(trigger)
  })

  it('Tab desde el último elemento vuelve al primero, sin escaparse a la página de fondo', () => {
    // El bug: el overlay solo bloqueaba el ratón; con el teclado se tabulaba
    // hacia la app "bloqueada" de fondo y se podía operar.
    render(<PageWithModal />)
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }))

    const closeButton = screen.getByRole('button', { name: 'Cerrar' })
    const segundo = screen.getByRole('button', { name: 'Segundo' })

    segundo.focus()
    fireEvent.keyDown(document, { key: 'Tab' })

    expect(document.activeElement).toBe(closeButton)
  })

  it('Shift+Tab desde el primero salta al último, sin salir del diálogo', () => {
    render(<PageWithModal />)
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }))

    const closeButton = screen.getByRole('button', { name: 'Cerrar' })
    const segundo = screen.getByRole('button', { name: 'Segundo' })

    closeButton.focus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })

    expect(document.activeElement).toBe(segundo)
  })

  it('si el foco escapa al fondo, el siguiente Tab lo devuelve al diálogo', () => {
    render(<PageWithModal />)
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }))

    screen.getByRole('link', { name: 'Enlace del fondo' }).focus()
    fireEvent.keyDown(document, { key: 'Tab' })

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cerrar' }))
  })

  it('un modal bloqueante (sin Escape) no se cierra con Escape pero sigue atrapando el foco', () => {
    // Es el caso del modal de T&C: bloqueante por diseño.
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="T&C" closeOnEscape={false} showCloseButton={false}>
        <button>Aceptar</button>
      </Modal>
    )

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()

    const aceptar = screen.getByRole('button', { name: 'Aceptar' })
    expect(document.activeElement).toBe(aceptar)

    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(aceptar)
  })
})
