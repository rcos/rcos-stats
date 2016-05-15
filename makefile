all: clean image info pdf

data:
	ssh root@rcos.io "rm -rf collections && mkdir collections"
	ssh root@rcos.io "mongoexport --db observatory3 --collection users --out collections/users.json"
	ssh root@rcos.io "mongoexport --db observatory3 --collection projects --out collections/projects.json"
	ssh root@rcos.io "mongoexport --db observatory3 --collection classyears --out collections/classyears.json"
	ssh root@rcos.io "mongoexport --db observatory3 --collection posts --out collections/posts.json"
	ssh root@rcos.io "mongoexport --db observatory3 --collection smallgroups --out collections/smallgroups.json"

copy:
	scp -r root@rcos.io:collections .

run:
	npm start

image:
	npm run imggen

info:
	npm run infogen

pdf:
	npm run pdfgen

clean:
	rm -rf output
	rm -f output.pdf

localdata:
	rm -rf collections && mkdir collections
	mongoexport --db observatory3-dev --collection users --out collections/users.json
	mongoexport --db observatory3-dev --collection projects --out collections/projects.json
	mongoexport --db observatory3-dev --collection classyears --out collections/classyears.json
	mongoexport --db observatory3-dev --collection posts --out collections/posts.json
	mongoexport --db observatory3-dev --collection smallgroups --out collections/smallgroups.json

sampledata:
	rm -rf collections && cp -r samplecollections collections
