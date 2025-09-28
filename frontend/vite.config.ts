import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080, open: true,
    proxy: {
      '/api': {
        target: 'http://54.235.167.147:8000',
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite the path
      },
    }
   },
  preview: { port: 8080 },
  resolve: { 
    alias: { 
      '@': path.resolve(__dirname, 'src') 
    } 
  }
});
