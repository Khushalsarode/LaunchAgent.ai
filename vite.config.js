import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react() // This handles both React and Fast Refresh
  ],
  define: {
    // This stops the "process is not defined" error from the ElevenLabs SDK
    "process.env": {},
  },
})