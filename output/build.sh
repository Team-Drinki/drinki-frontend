#!/bin/sh
set -eu

# Build a clean deploy directory at ./output inside this repository.
rm -rf ./output
mkdir -p ./output

# Copy repository contents except VCS/CI artifacts and output itself.
find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name '.github' \
  ! -name '.env' \
  ! -name '.env.*' \
  ! -name 'node_modules' \
  ! -name '.next' \
  ! -name 'tsconfig.tsbuildinfo' \
  ! -name 'output' \
  -exec cp -R {} ./output/ \;
