const { defineConfig } = require('@vscode/test-electron');

module.exports = defineConfig({
  files: 'out/test/**/*.test.js',
});
