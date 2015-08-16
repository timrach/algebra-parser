.PHONY: test

bundle:
	./node_modules/.bin/browserify src/algebra-parser.js --standalone algebra-parser > build/algebra-parser.js

minify: bundle
	./node_modules/.bin/uglifyjs --mangle --beautify ascii_only=true,beautify=false build/algebra-parser.js > build/algebra-parser.min.js

test:
	./node_modules/.bin/jasmine-node test

test-coveralls:
	./node_modules/.bin/istanbul cover ./node_modules/.bin/jasmine-node --captureExceptions test && \
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js