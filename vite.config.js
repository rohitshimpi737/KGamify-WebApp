import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['ca253614a22c.ngrok-free.app'],
      proxy: {
      '/mtalkz-api': {
        target: 'https://msgn.mtalkz.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/mtalkz-api/, '/api'),
        headers: {
          'Origin': 'https://msgn.mtalkz.com'
        }
      }
    }
  },
})
