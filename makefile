.PHONY:  all run image info pdf clean remote sample remotedata copyremote localdata savedata sampledata samplecsv

all: clean image info pdf

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

remote: remotedata copyremote

sample: sampledata samplecsv

remotedata:
	ssh root@rcos.io "rm -rf collections && mkdir collections"
	ssh root@rcos.io "mongoexport --db observatory3 --collection users --out collections/users.json"
	ssh root@rcos.io "mongoexport --db observatory3 --collection projects --out collections/projects.json"
	ssh root@rcos.io "mongoexport --db observatory3 --collection classyears --out collections/classyears.json"
	ssh root@rcos.io "mongoexport --db observatory3 --collection posts --out collections/posts.json"
	ssh root@rcos.io "mongoexport --db observatory3 --collection smallgroups --out collections/smallgroups.json"
	ssh root@rcos.io "mongoexport --db observatory3 --collection attendances --out collections/attendances.json"

copyremote:
	scp -r root@rcos.io:collections .

localdata:
	rm -rf collections && mkdir collections
	mongoexport --db observatory3-dev --collection users --out collections/users.json
	mongoexport --db observatory3-dev --collection projects --out collections/projects.json
	mongoexport --db observatory3-dev --collection classyears --out collections/classyears.json
	mongoexport --db observatory3-dev --collection posts --out collections/posts.json
	mongoexport --db observatory3-dev --collection smallgroups --out collections/smallgroups.json
	mongoexport --db observatory3-dev --collection attendances --out collections/attendances.json

sampledata:
	rm -rf collections && cp -r samplecollections collections

samplecsv:
	mkdir -p csvs && cp samplecsvs/* csvs

savedata:
	rm -rf samplecollections && cp -r collections samplecollections
	mkdir -p csvs
	cp -r csvs/* samplecsvs
