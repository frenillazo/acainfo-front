import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renderiza el contenido y es type="button" por defecto (no submit)', () => {
    render(<Button>Guardar</Button>)

    const button = screen.getByRole('button', { name: 'Guardar' })
    expect(button).toHaveAttribute('type', 'button')
  })

  it('dispara onClick al hacer click', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Guardar</Button>)

    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('deshabilitado no dispara onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Guardar
      </Button>
    )

    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('isLoading deshabilita el botón y muestra el loadingText', () => {
    render(
      <Button isLoading loadingText="Guardando...">
        Guardar
      </Button>
    )

    const button = screen.getByRole('button', { name: /Guardando/ })
    expect(button).toBeDisabled()
  })
})
