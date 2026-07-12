import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Sin globals:true vitest no expone afterEach global y testing-library
// no registra su auto-cleanup: hay que hacerlo explícito
afterEach(() => {
  cleanup()
})
