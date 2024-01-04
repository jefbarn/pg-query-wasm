import esbuild from 'esbuild'

await esbuild.build({
    entryPoints: ['index.ts'],
    format: 'esm',
    bundle: true,
    minify: true,
    keepNames: true,
    // platform: 'node',
    outfile: 'dist/index.js',
})
