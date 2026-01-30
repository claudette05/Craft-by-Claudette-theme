import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 9002,
        host: '0.0.0.0',
        hmr: {
          host: '9000-firebase-craft-by-claudette-1767015415155.cluster-cbeiita7rbe7iuwhvjs5zww2i4.cloudworkstations.dev',
          protocol: 'wss',
          clientPort: 443
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
