import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 3000,
    proxy: {
      '/api/gemini': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gemini/, '/v1beta/models/gemini-pro:generateContent'),
        headers: {
          'Origin': 'http://localhost:3000'
        }
      }
    }
  },
  preview: {
    host: true,
    strictPort: true,
    port: 3000
  }
})
