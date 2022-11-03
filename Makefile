.PHONY: build run deploy

include .env
export

build:
	yarn build

run:
	yarn start

deploy: build
	aws s3 sync ./build s3://${AWS_S3_BUCKET} --no-verify-ssl
