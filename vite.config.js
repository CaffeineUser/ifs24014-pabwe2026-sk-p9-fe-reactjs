import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'compression'

const apiProxy = {
  '/api': {
    target: 'http://localhost:8081',
    changeOrigin: true,
  },
}

// vite preview tidak mengompres respons, sedangkan hosting statis (Netlify/Vercel) selalu mengompres.
const previewCompression = () => ({
  name: 'preview-compression',
  configurePreviewServer(server) {
    server.middlewares.use(compression())
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), previewCompression()],
  server: { port: 5174, proxy: apiProxy },
  preview: { port: 5174, proxy: apiProxy },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // Vitest 4 hanya melaporkan berkas yang termuat, jadi cakupan ditentukan eksplisit.
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/setupTests.js', 'src/**/*.test.{js,jsx}'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
})