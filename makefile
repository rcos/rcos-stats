all: clean generate pdf

run:
	npm start

generate:
	npm run main

pdf:
	npm run pdf

clean:
	rm -rf output
