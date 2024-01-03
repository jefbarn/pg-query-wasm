import esbuild from 'esbuild'

await esbuild.build({
    entryPoints: ['main.ts'],
    format: 'esm',
    bundle: true,
    minify: true,
    // platform: 'node',
    outfile: 'dist/index.js',
})
