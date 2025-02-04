import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const rootDir = resolve(__dirname);

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        'test/**',
        'vite.config.ts',
      ],
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/dist/**'],
    globals: true,
    include: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    setupFiles: [resolve(rootDir, './scripts/vitest.setup.ts')],
  },
});
