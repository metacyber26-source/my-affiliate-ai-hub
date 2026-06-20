import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Konfigurasi wajib agar Vite bisa membaca komponen React Anda
export default defineConfig({
  plugins: [react()],
})
