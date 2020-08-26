export PATH := $(shell pwd)/node_modules/.bin:$(PATH)

.PHONY: node_and_pnpm build serve clean

# the rule that gets run by default is build
all: build

# rule to check if Node.js, NPM, and PNPM are present
node_and_pnpm:
ifeq (, $(shell which node))
	$(error "Cannot find Node.js in $(PATH). Check if you have it installed.")
else
ifeq (, $(shell which npm))
	$(error "Cannot find NPM in $(PATH). Check if you have it installed.")
else
ifeq (, $(shell which pnpm))
	@echo "Cannot find PNPM. Installing it into this project's node_modules directory..."
	npm install --no-save pnpm
	@echo "Installed!"
endif
endif
endif

# rule to install dependencies
node_modules: node_and_pnpm
	pnpm install

# build the project
build: clean node_modules
	parcel build index.html

# serve the project
serve: clean node_modules
	parcel index.html

# clean the project
clean:
	rm -rf dist/ .cache/
