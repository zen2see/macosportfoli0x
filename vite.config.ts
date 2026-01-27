import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// const __dirname = dirname(fileURLToPath(import.meta.url))
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '#components': resolve(dirname(fileURLToPath(import.meta.url)), 'src/components'),
      '#constants': resolve(dirname(fileURLToPath(import.meta.url)), 'src/constants'),
      '#utilities': resolve(dirname(fileURLToPath(import.meta.url)), 'src/utilities'),
      '#store': resolve(dirname(fileURLToPath(import.meta.url)), 'src/store'),
      '#hoc': resolve(dirname(fileURLToPath(import.meta.url)), 'src/hoc'),
      '#windows': resolve(dirname(fileURLToPath(import.meta.url)), 'src/windows'),
    },
  },
});