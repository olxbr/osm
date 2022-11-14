.PHONY: build run deploy

include .env
export

build:
	@cp src/config.js.prod src/config.js
	yarn build

run:
	@cp src/config.js.local src/config.js
	yarn start

deploy: build
	aws s3 sync ./build s3://${AWS_S3_BUCKET}
