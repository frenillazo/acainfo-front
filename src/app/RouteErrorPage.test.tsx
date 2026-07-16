import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { RouteErrorPage } from './RouteErrorPage'

afterEach(cleanup)

/** Monta una ruta que revienta al entrar, con RouteErrorPage como errorElement. */
function renderWithError(error: unknown) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <p>nunca se ve</p>,
        loader: () => {
          throw error
        },
        errorElement: <RouteErrorPage />,
      },
    ],
    { initialEntries: ['/'] }
  )
  return render(<RouterProvider router={router} />)
}

describe('RouteErrorPage', () => {
  it('trata el fallo de carga de un chunk como "hay versión nueva", no como un error del usuario', async () => {
    // El caso real: se despliega mientras alguien tiene la app abierta y su
    // index apunta a chunks con un hash que ya no existe.
    renderWithError(
      new Error('Failed to fetch dynamically imported module: /assets/Page-a1b2c3.js')
    )

    expect(await screen.findByText('Hay una versión nueva de la app')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Recargar/ })).toBeInTheDocument()
    // Volver al panel no arreglaría nada: el chunk seguiría sin existir.
    expect(screen.queryByRole('link', { name: /Ir a mi panel/ })).not.toBeInTheDocument()
  })

  it('ante un error cualquiera ofrece recargar y volver al panel', async () => {
    renderWithError(new Error('algo raro'))

    expect(await screen.findByText('Algo ha ido mal')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Recargar/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ir a mi panel/ })).toHaveAttribute(
      'href',
      '/dashboard'
    )
  })

  it('el botón Recargar recarga de verdad', async () => {
    const reload = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { ...window.location, reload },
      writable: true,
    })

    renderWithError(new Error('algo raro'))
    fireEvent.click(await screen.findByRole('button', { name: /Recargar/ }))

    expect(reload).toHaveBeenCalled()
  })
})
