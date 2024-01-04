import { ParseResult } from './build/pg_query_pb.js'
import createModule from './build/pg-query-wasm.js'

export class PgQueryError extends Error {
  funcname: string
  filename: string
  lineno: number
  cursorpos: number
  context: string

  constructor(mod: any, errorPtr: number) {
    super()

    this.message = mod.UTF8ToString(mod.getValue(errorPtr, '*'))
    this.funcname = mod.UTF8ToString(mod.getValue(errorPtr + 4, '*'))
    this.filename = mod.UTF8ToString(mod.getValue(errorPtr + 8, '*'))
    this.lineno = mod.getValue(errorPtr + 12, 'i32')
    this.cursorpos = mod.getValue(errorPtr + 16, 'i32')
    this.context = mod.UTF8ToString(mod.getValue(errorPtr + 20, '*'))
  }
}

const modPromise = createModule()

export async function parse(query: string): Promise<ParseResult> {
  const mod = await modPromise

  const resultPtr = mod._malloc(12)
  mod.ccall('pg_query_parse', null, ['number', 'string'], [resultPtr, query])

  const parseTreePtr = mod.getValue(resultPtr, '*')
  const stderrBufPtr = mod.getValue(resultPtr + 4, '*')
  const errorPtr = mod.getValue(resultPtr + 8, '*')

  const parseTree = JSON.parse(mod.UTF8ToString(parseTreePtr))
  const stderrBuf = mod.UTF8ToString(stderrBufPtr)

  let error: PgQueryError
  if (errorPtr) {
    error = new PgQueryError(mod, errorPtr)
  }

  mod.ccall('pg_query_free_parse_result', null, ['number'], [resultPtr])
  mod._free(resultPtr)

  if (error) {
    throw error
  } else {
    return parseTree
  }
}

export async function parse_pb(query: string): Promise<ParseResult> {
  const mod = await modPromise

  const resultPtr = mod._malloc(16)
  mod.ccall('pg_query_parse_protobuf', null, ['number', 'string'], [resultPtr, query])

  const parseTreeLen = mod.getValue(resultPtr, '*')
  const parseTreePtr = mod.getValue(resultPtr + 4, '*')
  const stderrBufPtr = mod.getValue(resultPtr + 8, '*')
  const errorPtr = mod.getValue(resultPtr + 12, '*')
  // console.log({ parseTreeLen, parseTreePtr, stderrBufPtr, errorPtr })

  const parseTreeBuf = new Uint8Array(mod.HEAPU8.buffer, parseTreePtr, parseTreeLen);
  const parseTree = ParseResult.fromBinary(parseTreeBuf)
  // const stderrBuf = mod.UTF8ToString(stderrBufPtr)

  let error: PgQueryError
  if (errorPtr) {
    error = new PgQueryError(mod, errorPtr)
  }

  mod.ccall('pg_query_free_protobuf_parse_result', null, ['number'], [resultPtr])
  mod._free(resultPtr)

  if (error) {
    throw error
  } else {
    return parseTree
  }
}
