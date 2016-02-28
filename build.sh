#!/bin/bash
rm -rf ./build
./node_modules/.bin/babel --stage 0 --out-dir ./build ./src
find ./build -type f -name '*.jsx' -exec sh -c 'mv -f $0 ${0%.jsx}.js' {} \;