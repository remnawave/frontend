.PHONY: download-monaco-deps clean

MONACO_FILES = \
	public/wasm_exec.js \
	public/xray.schema.json \
	public/main.wasm

MONACO_BASE_URL = https://remnawave.github.io/xray-monaco-editor

download-monaco-deps: $(MONACO_FILES)

public/wasm_exec.js:
	@mkdir -p public
	curl -o $@ $(MONACO_BASE_URL)/wasm_exec.js

public/xray.schema.json:
	@mkdir -p public 
	curl -o $@ $(MONACO_BASE_URL)/xray.schema.json

public/main.wasm:
	@mkdir -p public
	curl -o $@ $(MONACO_BASE_URL)/main.wasm

clean:
	rm -f $(MONACO_FILES)
