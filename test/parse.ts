import { parse } from '../dist/index.js'

try {
  console.dir(await parse('SELECT 1;'), { depth: null })
  console.dir(await parse('SELECT THIS SHOULD ERROR;'), { depth: null })
} catch (err) {
  console.error(err)
}
