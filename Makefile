LIB_PG_QUERY_TAG = 16-5.0.0

BUILD_DIR = ./build
LIB_DIR = $(BUILD_DIR)/libpg_query
DIST_DIR = ./dist

LIB = $(BUILD_DIR)/libpg_query.a
LIB_GZ = $(BUILD_DIR)/libpg_query-$(LIB_PG_QUERY_TAG).tar.gz
WASM = $(BUILD_DIR)/pg-query-wasm.js
PROTO_TS = $(BUILD_DIR)/pg_query.ts
TSC_DTS = $(BUILD_DIR)/dts/main.d.ts
DIST_DTS = $(DIST_DIR)/index.d.ts
DIST_JS = $(DIST_DIR)/index.js

.DELETE_ON_ERROR:

default: dist

$(BUILD_DIR):
	mkdir -pv $(BUILD_DIR)

$(LIB_GZ): | $(BUILD_DIR)
	curl -o $(LIB_GZ) https://codeload.github.com/pganalyze/libpg_query/tar.gz/refs/tags/$(LIB_PG_QUERY_TAG)

$(LIB_DIR): $(LIB_GZ)
	mkdir -pv $(LIB_DIR)
	tar -xzf $(LIB_GZ) -C $(LIB_DIR) --strip-components=1

.PHONY: lib
lib: $(LIB)
$(LIB): | $(LIB_DIR)
	cp pg_config.h $(LIB_DIR)/src/postgres/include/pg_config.h
	cd $(LIB_DIR); CFLAGS=-flto emmake make build
	mv $(LIB_DIR)/libpg_query.a $(BUILD_DIR)

.PHONY: wasm
wasm: $(WASM)
$(WASM): $(LIB)
#		-s INCOMING_MODULE_JS_API=print,printErr,noInitialRun
	emcc \
		-o $@ \
		-Wall \
		-O2 -flto \
		-lembind \
		--pre-js module.js \
		-s EXPORT_ES6 \
		-s MODULARIZE \
		-s SINGLE_FILE \
		-s ENVIRONMENT=web \
		-s EXPORT_NAME=createModule \
		-s EXPORTED_FUNCTIONS=_malloc,_free,_pg_query_parse,_pg_query_free_parse_result \
		-s EXPORTED_RUNTIME_METHODS=ALLOC_NORMAL,intArrayFromString,allocate,ccall,UTF8ToString,getValue,setValue \
		-I $(LIB_DIR) -I $(LIB_DIR)/vendor \
		$(LIB) entry.cpp
	#gzip -k -9 $(BUILD_DIR)/pg-query-wasm.wasm

.PHONY: proto
proto: $(PROTO_TS)
$(PROTO_TS): $(LIB_DIR)
	npm install
	protoc \
		--plugin=./node_modules/.bin/protoc-gen-ts_proto \
		--ts_proto_opt=stringEnums=true \
		--ts_proto_opt=onlyTypes=true \
		--ts_proto_out=. \
		$(LIB_DIR)/protobuf/pg_query.proto
	mv $(LIB_DIR)/protobuf/pg_query.ts $(BUILD_DIR)

$(TSC_DTS): $(PROTO_TS)
	tsc

$(DIST_DTS): $(TSC_DTS)
	api-extractor run

$(DIST_JS): $(WASM)
	node build.js

.PHONY: dist
dist: $(DIST_JS) $(DIST_DTS)

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)
	rm -rf $(DIST_DIR)
