#!/bin/bash

# Build the project
yarn build

# Create a temporary directory
mkdir -p temp-gh-pages

# Copy data and logo directories
cp -r packages/chain-list/build/data/* temp-gh-pages/
mkdir -p temp-gh-pages/logo
cp -r packages/chain-list/build/logo/* temp-gh-pages/logo/

# Deploy both directories
npx gh-pages --dist temp-gh-pages --branch gh-pages

# Clean up
rm -rf temp-gh-pages 