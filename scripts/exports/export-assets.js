import { Parser } from '@json2csv/plainjs';
import { createRequire } from 'module';
import fs from "fs";

const require = createRequire(import.meta.url);
const ChainAssetMap = require('../../packages/chain-list/src/data/ChainAsset.json');
const AssetRefMap = require('../../packages/chain-list/src/data/AssetRef.json');

const LOGO_URL = 'https://raw.githubusercontent.com/bitriel/BitrielWallet-ChainList/master/packages/chain-list/src/logo';

const allAssets = [];

function getAssetRef (chainAsset) {
  let destChains = '';

  Object.values(AssetRefMap).forEach((assetRef) => {
    if (assetRef.srcAsset === chainAsset.slug) {
      if (destChains.length > 0) {
        destChains = destChains.concat(', ');
      }

      destChains = destChains.concat(assetRef.destChain);
    }
  });

  return destChains;
}

Object.values(ChainAssetMap).forEach((chainAsset) => {
  allAssets.push({
    slug: chainAsset.slug,
    name: chainAsset.name,
    symbol: chainAsset.symbol,
    originChain: chainAsset.originChain,
    type: chainAsset.assetType,
    priceId: chainAsset.priceId,
    hasValue: chainAsset.hasValue,
    xcmDestination: getAssetRef(chainAsset),
    multiChainAsset: chainAsset.multiChainAsset,
    icon: `${LOGO_URL}/${chainAsset.icon}`
  });
});

console.log(`Parsed ${allAssets.length} assets`);

try {
  const opts = {
    fields: ['name', 'symbol', 'originChain', 'type', 'priceId', 'multiChainAsset', 'xcmDestination', 'hasValue', 'slug', 'icon'],
  };
  const parser = new Parser(opts);
  const csv = parser.parse(allAssets);

  const fileName = `exports/supported-assets.csv`;

  fs.mkdirSync('exports', { recursive: true });
  fs.writeFile(fileName, csv, function(err) {
    if (err) throw err;
    console.log(`Saved ${fileName} successfully`);
  });
} catch (err) {
  console.error(err);
}
