LIB_PG_QUERY_TAG = 4ff9bb1

ROOT_DIR := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))
BUILD_DIR = ./build
LIB_DIR = $(BUILD_DIR)/libpg_query
DIST_DIR = ./dist

LIB = $(BUILD_DIR)/libpg_query.a
LIB_GZ = $(BUILD_DIR)/libpg_query-$(LIB_PG_QUERY_TAG).tar.gz
WASM = $(BUILD_DIR)/pg-query-wasm.js
PROTO_TS = $(BUILD_DIR)/pg_query_pb.ts
TSC_DTS = $(BUILD_DIR)/dts/main.d.ts
DIST_DTS = $(DIST_DIR)/index.d.ts
DIST_JS = $(DIST_DIR)/index.js

.DELETE_ON_ERROR:

default: dist

$(BUILD_DIR):
	mkdir -pv $(BUILD_DIR)

$(LIB_GZ): | $(BUILD_DIR)
	curl -L -o $(LIB_GZ) https://github.com/pganalyze/libpg_query/archive/$(LIB_PG_QUERY_TAG).tar.gz
	@#curl -o $(LIB_GZ) https://codeload.github.com/pganalyze/libpg_query/tar.gz/refs/tags/$(LIB_PG_QUERY_TAG)

$(LIB_DIR): $(LIB_GZ)
	mkdir -pv $(LIB_DIR)
	tar -xzf $(LIB_GZ) -C $(LIB_DIR) --strip-components=1

.PHONY: lib
lib: $(LIB)
$(LIB): | $(LIB_DIR)
	#cp pg_config.h $(LIB_DIR)/src/postgres/include/pg_config.h
	cd $(LIB_DIR); CFLAGS=-flto emmake make build
	mv $(LIB_DIR)/libpg_query.a $(BUILD_DIR)

.PHONY: wasm
wasm: $(WASM)
$(WASM): $(LIB)
	emcc \
		-o $@ \
		-Wall \
		-Oz -flto \
		-sEXPORT_ES6 \
		-sMODULARIZE \
		-sSINGLE_FILE \
		-sENVIRONMENT=web \
		-sEXPORT_NAME=createModule \
		-sINCOMING_MODULE_JS_API=[] \
		-sEXPORTED_FUNCTIONS=@$(ROOT_DIR)exported \
		-sEXPORTED_RUNTIME_METHODS=ccall,UTF8ToString,getValue \
		-I $(LIB_DIR) -I $(LIB_DIR)/vendor \
		$(LIB)

.PHONY: proto
proto: $(PROTO_TS)
$(PROTO_TS): $(LIB_DIR)
	npx buf generate ./build/libpg_query/protobuf

$(TSC_DTS): $(PROTO_TS)
	tsc

$(DIST_DTS): $(TSC_DTS)
	api-extractor run

$(DIST_JS): $(WASM) main.ts build.js
	node build.js

.PHONY: dist
dist: $(DIST_JS) $(DIST_DTS)

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)
	rm -rf $(DIST_DIR)
