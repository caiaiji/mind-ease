import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/mind-ease/',
  define: {
    __BUILD_TIME__: JSON.stringify(Date.now()),
  },
})
