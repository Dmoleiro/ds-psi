import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: https://dmoleiro.github.io/ds-psi/
// Local dev uses "/" — set VITE_BASE_PATH=/ds-psi/ when building for GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
})
