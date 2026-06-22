import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 1800,
    rollupOptions: {
      output: {
        // Split the large curated dataset into its own cacheable chunk so app
        // code can change without re-downloading the data (and vice versa).
        manualChunks(id) {
          if (id.includes('dataset.json')) return 'dataset'
        },
      },
    },
  },
})
