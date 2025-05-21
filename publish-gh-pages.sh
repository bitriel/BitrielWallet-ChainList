#!/bin/bash

# Update JSON files to use GitHub Pages URLs
echo "Updating JSON files to use GitHub Pages URLs..."
node scripts/patch/update-icon-urls.js
node scripts/patch/update-asset-logo-map.js

# Build the project
yarn build

# Copy asset logos from local assets
echo "Copying asset logos from local assets..."
node scripts/patch/copy-local-assets.js

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