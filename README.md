## pg-query-wasm

This is a WebAssembly port of the excelent [libpg_query](https://github.com/pganalyze/libpg_query),
which is an extration of the query parser from the Postgres source code.

This is also a fork/continuation of the work done in [pg-query-emscripten](https://github.com/pganalyze/pg-query-emscripten)
which was targeted to asm.jsand hasn't been updated in quite a while.

The notable features are:

- Updated to support Postgres 16.
- WebAssembly build that can be used in _any_ modern JS runtime.
- Typescript typings are provided (extracted from the libpg_query protocol buffers).

There is much prior art in this space which I've tried to list below.

| Project                                                                 | Description                                                      |
|-------------------------------------------------------------------------|------------------------------------------------------------------|
| [libpg_query](https://github.com/pganalyze/libpg_query)                 | Main project responsible for isolating the Postgres query parser |
| [pg-query-emscripten](https://github.com/pganalyze/pg-query-emscripten) | Did much of the work figuring out how to configure emscripten    |
| [Postgres](https://github.com/postgres/postgres)                        | Where all the C code comes from                                  |
| [libpg-query-node](https://github.com/launchql/libpg-query-node)        | NodeJS natively compiled port                                    |
