import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    environmentMatchGlobs: [
      // Server-side code runs in node environment
      ['src/__tests__/**', 'node'],
      ['src/app/api/**/__tests__/**', 'node'],
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
