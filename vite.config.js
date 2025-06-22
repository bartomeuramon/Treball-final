import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // <- això et cal per a "path.resolve"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
