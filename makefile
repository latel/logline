PATH := node_modules/.bin:$(PATH)

default: clean dev prod test

dev:
	npm run build:dev

prod:
	npm run build:prod

test:
	npm run test

clean:
	@rm -f dist/*
