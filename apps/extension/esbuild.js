// @ts-check
const esbuild = require('esbuild');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    format: 'cjs',
    minify: false,
    sourcemap: true,
    sourcesContent: false,
    platform: 'node',
    outfile: 'dist/extension.js',
    external: ['vscode'],
    logLevel: 'silent',
    metafile: true,
  });

  if (watch) {
    await ctx.watch();
    console.log('[LoopGuard] Watching for changes...');
  } else {
    const result = await ctx.rebuild();
    await ctx.dispose();
    if (!production) {
      const outputs = Object.keys(result.metafile?.outputs ?? {});
      console.log(`[LoopGuard] Built: ${outputs.join(', ')}`);
    }
  }
}

main().catch((e) => {
  console.error('[LoopGuard] Build failed:', e);
  process.exit(1);
});
