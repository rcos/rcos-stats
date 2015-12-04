all: clean generate pdf

users:
	ssh root@rcos.io "mongoexport --db observatory3  --collection users  --out users.json"
	scp root@rcos.io:users.json .

run:
	npm start

generate:
	npm run main

pdf:
	npm run pdf

clean:
	rm -rf output
	rm -f output.pdf
