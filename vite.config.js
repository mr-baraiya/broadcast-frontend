import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/match': {
        target: 'http://127.0.0.1:6020',
        changeOrigin: true
      },
      '/matches': {
        target: 'http://127.0.0.1:6020',
        changeOrigin: true
      },
      '/ws': {
        target: 'ws://127.0.0.1:6020',
        ws: true
      }
    }
  }
})
