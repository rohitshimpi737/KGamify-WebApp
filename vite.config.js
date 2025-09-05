import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import removeConsole from "vite-plugin-remove-console";

export default defineConfig({
  plugins: [react(), tailwindcss() , removeConsole()],
  server: {
    allowedHosts: ['33dcee90d62f.ngrok-free.app'],
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