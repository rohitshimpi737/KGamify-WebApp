import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import removeConsole from "vite-plugin-remove-console"
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    removeConsole()
  ],
  
  base: '/', 
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@public': path.resolve(__dirname, './public'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components')
    }
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild', // Changed from terser to esbuild for faster builds
    chunkSizeWarningLimit: 1500, // Increased limit
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': ['@headlessui/react', '@heroicons/react'],
        },
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.')[1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    }
  },

  server: {
    port: 5173,
    host: true, // Added for network access
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

  preview: {
    port: 4173,
    open: true
  }
})