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
  return mod.parse(query) as ParseUnion
}
