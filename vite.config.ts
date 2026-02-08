import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { join } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        // Copy index.html to 404.html for GitHub Pages SPA routing
        const distPath = join(__dirname, 'dist')
        copyFileSync(
          join(distPath, 'index.html'),
          join(distPath, '404.html')
        )
      }
    }
  ],
  // All environments use root path (/)
  // Can override with VITE_BASE_PATH environment variable if needed
  base: process.env.VITE_BASE_PATH ?? '/',
  server: {
    port: 3000,
    open: true
  }
})
