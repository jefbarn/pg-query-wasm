LIB_PG_QUERY_TAG = 16-5.0.0

BUILD_DIR = ./build
LIB_DIR = $(BUILD_DIR)/libpg_query

LIB = $(LIB_DIR)/libpg_query.a
LIB_GZ = $(BUILD_DIR)/libpg_query-$(LIB_PG_QUERY_TAG).tar.gz
JS_MOD = $(BUILD_DIR)/pg-query-wasm.js
PROTO_TS = $(BUILD_DIR)/pg_query.ts

default: module

$(BUILD_DIR):
	mkdir -p $@

$(LIB_GZ): $(BUILD_DIR)
	curl -o $@ https://codeload.github.com/pganalyze/libpg_query/tar.gz/refs/tags/$(LIB_PG_QUERY_TAG)

$(LIB_DIR): $(LIB_GZ)
	mkdir -p $(LIB_DIR)
	tar -xzf $(LIB_GZ) -C $(LIB_DIR) --strip-components=1

.PHONY: lib
lib: $(LIB)
$(LIB): $(LIB_DIR)
	cp pg_config.h $(LIB_DIR)/src/postgres/include/pg_config.h
	cd $(LIB_DIR); CFLAGS=-flto emmake make build

.PHONY: module
module: $(JS_MOD)
$(JS_MOD): $(LIB)
	emcc \
		-o $@ \
		-Os -flto --pre-js module.js -lembind -Wall \
		-I $(LIB_DIR) -I $(LIB_DIR)/vendor \
		-s MODULARIZE \
		-s EXPORTED_FUNCTIONS=_malloc,_free \
		-s EXPORTED_RUNTIME_METHODS=ALLOC_NORMAL,intArrayFromString,allocate \
		$(LIB) entry.cpp

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

.PHONY: clean
clean:
	rm -r $(BUILD_DIR)
