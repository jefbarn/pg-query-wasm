import { ParseResult } from './build/pg_query.js'
import createModule from './build/pg-query-wasm.js'

export interface ParseError {
  message: string
  funcname: string
  filename: string
  lineno: number
  cursorpos: number
  context: string
}
export interface ParseUnion {
  parse_tree?: ParseResult
  error?: ParseError
}

export async function parse(query: string) {
  const mod = await createModule()

  const pointer = mod._malloc(100)

  mod.ccall('pg_query_parse', null, ['number', 'string'], [pointer, query])

  const resultPtr = mod.getValue(pointer, '*')
  const result = JSON.parse(mod.UTF8ToString(resultPtr))
  console.log('result: ', { pointer, resultPtr })
  console.dir(result, { depth: null })

  mod.ccall('pg_query_free_parse_result', null, ['number'], [pointer])
  mod._free(pointer)
}
