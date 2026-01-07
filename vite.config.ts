import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Habit_and_Prayer_tracker/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
