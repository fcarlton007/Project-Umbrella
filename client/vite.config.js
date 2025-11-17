// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api will be sent to the Express server
      '/api': {
        target: 'http://localhost:3001', // <-- Target your Express port
        changeOrigin: true,
        secure: false, // For local development
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})