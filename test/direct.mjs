import createModule from '../build/pg-query-wasm.js'

export class PgQueryError extends Error {
  /**
   * @param mod
   * @param errorPtr {number}
   */
  constructor(mod, errorPtr) {
    super()

    this.message = mod.UTF8ToString(mod.getValue(errorPtr, '*'))
    this.funcname = mod.UTF8ToString(mod.getValue(errorPtr + 4, '*'))
    this.filename = mod.UTF8ToString(mod.getValue(errorPtr + 8, '*'))
    this.lineno = mod.getValue(errorPtr + 12, 'i32')
    this.cursorpos = mod.getValue(errorPtr + 16, 'i32')
    this.context = mod.UTF8ToString(mod.getValue(errorPtr + 20, '*'))
  }
}

try {
  console.dir(await parse('SELECT 1;'), { depth: null })
  console.dir(await parse('SELECT THIS DOESNT WORK;'), { depth: null })
} catch (err) {
  console.error(err)
}

/**
 * @param query {string}
 * @returns {Promise<ParseResult>}
 */
export async function parse(query) {
  const mod = await createModule()

  const resultPtr = mod._malloc(12)
  mod.ccall('pg_query_parse', null, ['number', 'string'], [resultPtr, query])

  const parseTreePtr = mod.getValue(resultPtr, '*')
  const stderrBufPtr = mod.getValue(resultPtr + 4, '*')
  const errorPtr = mod.getValue(resultPtr + 8, '*')

  const parseTree = JSON.parse(mod.UTF8ToString(parseTreePtr))
  const stderrBuf = mod.UTF8ToString(stderrBufPtr)

  console.log({ parseTreePtr, stderrBufPtr, errorPtr })
  let error
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
