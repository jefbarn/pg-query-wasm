const PgQueryFactory = require('../build/pg-query-wasm.js')

PgQueryFactory().then(mod => {
  const query = 'SELECT 1;'

  const result = mod.parse(query)
  console.dir(result, { depth: null })

  // var pointer = mod.allocate(mod.intArrayFromString(query), mod.ALLOC_NORMAL);
  // var parsed  = mod.raw_parse(pointer);
  // mod._free(pointer);
  //
  // parsed.parse_tree = JSON.parse(parsed['parse_tree']);
  //
  // console.log('result: ', parsed)

  // const resultPtr = mod.ccall(
  //   'pg_query_parse',
  //   'array',
  //   ['string'],
  //   ['SELECT 1;']
  // )
  // const buf = mod._malloc(100)
  // mod.intArrayFromString(query, buf, 100)

  // const resultPtr = mod._pg_query_parse(buf)

  // console.log('resultPtr: ', resultPtr)
  // // console.log('heap: ', mod.HEAP8)
  //
  // const parseTreePtr = mod.getValue(resultPtr, '*')
  // const parseTree = mod.UTF8ToString(parseTreePtr)
  //
  // console.log('result: ', { resultPtr, parseTreePtr, parseTree })

  // mod._free(buf)

  // mod.ccall('pg_query_free_parse_result', null, ['number'], [resultPtr])
})
