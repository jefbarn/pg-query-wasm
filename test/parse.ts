import { parse } from '../dist/index.js'

console.dir(await parse('SELECT 1;'), { depth: null })

console.dir(await parse('SELECT THIS SHOULD ERROR;'), { depth: null })
