import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: [],
    projects: [
      {
        plugins: [react()],
        test: {
          name: 'node',
          environment: 'node',
          include: [
            'src/__tests__/**/*.{test,spec}.{ts,tsx}',
            'src/app/api/**/__tests__/**/*.{test,spec}.{ts,tsx}',
          ],
        },
        resolve: {
          alias: {
            '@': path.resolve(__dirname, './src'),
          },
        },
      },
      {
        plugins: [react()],
        test: {
          name: 'jsdom',
          environment: 'jsdom',
          include: ['src/**/*.{test,spec}.{ts,tsx}'],
          exclude: [
            'src/__tests__/**/*.{test,spec}.{ts,tsx}',
            'src/app/api/**/__tests__/**/*.{test,spec}.{ts,tsx}',
            '**/node_modules/**',
          ],
        },
        resolve: {
          alias: {
            '@': path.resolve(__dirname, './src'),
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
