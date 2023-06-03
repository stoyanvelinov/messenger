import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5555,
  },
  optimizeDeps: {
    exclude: ['react-firebase-hooks']
  }
});
