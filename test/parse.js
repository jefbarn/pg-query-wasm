import { parse } from '../dist/pg-query-wasm.mjs'

const result = await parse('SELECT 1;')
console.dir(result, { depth: null })
