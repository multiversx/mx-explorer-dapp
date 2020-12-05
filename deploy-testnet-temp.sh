#!/bin/bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ "$BRANCH" != "master" ]]; then
  echo 'Not on [master] branch - Aborting';
  exit 1;
fi

rm -rf ./build

npm run build-testnet

aws s3 sync ./build s3://testnet-explorer.elrond.com-temp

curl --request POST \
  --url ***REMOVED*** \
  --header 'content-type: application/json' \
  --data '{"text": "manual deploy https://testnet-explorer.elrond.com"}'

echo 'Done!'
