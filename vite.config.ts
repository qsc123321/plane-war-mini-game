import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const devEntry = resolve(__dirname, 'dev.html');

export default defineConfig(({ mode }) => {
  if (mode === 'direct-open') {
    return {
      base: './',
      build: {
        outDir: '.direct-open-dist',
        emptyOutDir: true,
        lib: {
          entry: 'src/main.ts',
          formats: ['es'],
          fileName: () => 'game.bundle.js',
          cssFileName: 'game.bundle',
        },
        cssCodeSplit: false,
      },
      server: {
        host: '0.0.0.0',
        port: 5173,
      },
    };
  }

  return {
    base: './',
    build: {
      rollupOptions: {
        input: devEntry,
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
  };
});
