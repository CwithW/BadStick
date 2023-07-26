.PHONY: client 

client:
	rm -rf ./dist
	mkdir dist
	tsc
	cp -r node_modules dist/node_modules
	cp ./extra/config.json dist/config.json
