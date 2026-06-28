// @ts-check
// Root ESLint config (flat config — ESLint v9+).
// Enforces no-console across the monorepo; individual apps can extend.

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
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

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    // All TypeScript and TSX files in the monorepo
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  {
    // Extension/API production code should use the logger utilities.
    files: ['apps/extension/src/**/*.ts', 'apps/api/src/**/*.ts'],
    rules: {
      'no-console': 'error',
    },
  },

  {
    // Allow console in scripts, config files, and test files.
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
];
