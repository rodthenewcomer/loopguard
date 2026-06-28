// @ts-check
// Root ESLint config (flat config — ESLint v9+).
// Enforces no-console across the monorepo; individual apps can extend.

import js from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,

  {
    // All TypeScript and TSX files in the monorepo
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      // Ban console.* in production code — use the logger utility instead.
      // Violating this is a RULES.md item: "No console.log in extension or API code."
      'no-console': 'error',

      // Warn on unused variables (TypeScript compiler catches most, but ESLint covers JS too)
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },

  {
    // Allow console in scripts, config files, and test files
    files: [
      'scripts/**/*.js',
      'scripts/**/*.ts',
      '*.config.js',
      '*.config.ts',
      'esbuild.js',
      '**/*.test.ts',
      '**/*.spec.ts',
    ],
    rules: {
      'no-console': 'off',
    },
  },

  {
    // Ignore compiled output, dependencies, and generated files
    ignores: [
      '**/dist/**',
      '**/out/**',
      '**/node_modules/**',
      '**/*.d.ts',
      'packages/context-engine/rust/**',
      'apps/web/.next/**',
    ],
  },
];
