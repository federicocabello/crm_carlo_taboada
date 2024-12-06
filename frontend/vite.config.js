import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendUrl = process.env.VITE_BACKEND_URL;

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': backendUrl,
    },
  },
});
