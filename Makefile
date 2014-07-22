start:
	./node_modules/.bin/nodemon app.js

test:
	./node_modules/.bin/mocha test

.PHONY: start test