all: clean generate pdf

users:
	ssh root@rcos.io "mongoexport --db observatory3  --collection users  --out users.json"
	ssh root@rcos.io "mongoexport --db observatory3  --collection projects  --out projects.json"
	scp root@rcos.io:projects.json .
	ssh root@rcos.io "mongoexport --db observatory3  --collection projects  --out projects.json"
	scp root@rcos.io:projects.json .


run:
	npm start

generate:
	npm run main

pdf:
	npm run pdf

clean:
	rm -rf output
	rm -f output.pdf
