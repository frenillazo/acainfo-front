import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Por encima del asyncUtilTimeout de setup.ts (5 s): si un findBy* agota su
    // espera, debe ganar el error de testing-library (dice qué no encontró y
    // vuelca el DOM) y no el "test timed out" de vitest, que no dice nada.
    testTimeout: 15000,
  },
})
