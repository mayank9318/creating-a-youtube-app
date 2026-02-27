import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy:{
      
      '/api/v1/users/register': 'http://localhost:8800'
    }
  },
  plugins: [react()],


})
