import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    alias: {
      '@loopguard/types': resolve(__dirname, '../types/src/index.ts'),
      '@loopguard/utils': resolve(__dirname, '../utils/src/index.ts'),
    },
  },
});
