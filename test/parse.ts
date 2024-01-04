import { parse, parse_pb } from '../dist/main.js'
import { parseQuery, parseQuerySync } from 'libpg-query'

try {
  console.time('pbuf')
  for (let x = 0; x < 10000; x++) {
    const res = (await parse_pb('SELECT 1;')).toJson()
  }
  console.timeEnd('pbuf')
  console.time('json')
  for (let x = 0; x < 10000; x++) {
    const res = await parse('SELECT 1;')
  }
  console.timeEnd('json')
  console.time('napi')
  for (let x = 0; x < 10000; x++) {
    const res = await parseQuery('SELECT 1;')
  }
  console.timeEnd('napi')

  // console.dir(await parse('SELECT THIS SHOULD ERROR;'), { depth: null })
} catch (err) {
  console.error(err)
}
