## pg-query-wasm

This is a WebAssembly port of the excelent [libpg_query](https://github.com/pganalyze/libpg_query),
which is an extration of the query parser from the Postgres source code.

This is also a fork/continuation of the work done in
[pg-query-emscripten](https://github.com/pganalyze/pg-query-emscripten),
which was targeted to asm.js and hasn't been updated in quite a while.

### Features

- Updated to support Postgres 16.
- WebAssembly build that can be used in _any_ modern JS runtime.
- Distributed as single .js file for easy consumption (Loading the wasm module is handled automatically.)
- Typescript typings are provided (extracted from the libpg_query protocol buffers).
- [Pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) module only. 
  Modern runtimes (Node 20+, Chrome 120+).

### Prior Art

There is much prior art in this space which I've tried to list below.

- [pganalyze/libpg_query](https://github.com/pganalyze/libpg_query)
  - Main project responsible for isolating the Postgres query parser
- [libpg_query](https://github.com/pganalyze/libpg_query)
  - Main project responsible for isolating the Postgres query parser
- [pg-query-emscripten](https://github.com/pganalyze/pg-query-emscripten)
  - Did much of the work figuring out how to configure emscripten
- [Postgres](https://github.com/postgres/postgres)
  - Where all the C code comes from
- [libpg-query-node](https://github.com/launchql/libpg-query-node)
  - Node.js natively compiled port
- [libpg-query-wasm](https://github.com/Hilzu/libpg-query-node/tree/main/packages/libpg-query-wasm)
  - Similar idea...uses protobuf for output
