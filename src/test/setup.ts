import { afterEach } from 'vitest'
import { cleanup, configure } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// El techo por defecto de `findBy*`/`waitFor` es 1 s, y NO es un retardo: son
// MutationObserver, así que resuelven en cuanto aparece el nodo y subirlo no
// cuesta nada cuando el test pasa. Con 19 ficheros en paralelo, un worker sin
// CPU puede tardar >1 s en resolver una query de TanStack y repintar, y el test
// fallaba sin que nada estuviera roto (FolderSelector, 17-jul-2026). Debe
// quedar MUY por debajo del `testTimeout` (15 s) para que gane el error
// descriptivo de testing-library y no el opaco de vitest.
configure({ asyncUtilTimeout: 5000 })

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
