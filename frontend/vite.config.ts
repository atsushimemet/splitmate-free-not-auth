import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    },
    outDir: 'dist',
    assetsDir: 'assets'
  },
  publicDir: 'public'
}) 
