import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// jsdom no implementa matchMedia y `useMediaQuery` lo necesita (lo usa el
// Sidebar para saber si está en móvil). Por defecto, ninguna query hace match.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

// Sin globals:true vitest no expone afterEach global y testing-library
// no registra su auto-cleanup: hay que hacerlo explícito
afterEach(() => {
  cleanup()
})
