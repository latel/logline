PATH := node_modules/.bin:$(PATH)

default: clean configure dev prod test

configure:
	npm run configure

dev:
	npm run build:dev

prod:
	npm run build:prod

test:
	npm run test

clean:
	@rm -f dist/*


.PHONY: default configure dev prod test clean
