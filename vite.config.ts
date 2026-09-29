import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// `base` is relative so the build works on GitHub Pages (served under /<repo>/).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
