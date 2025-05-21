// Copyright 2025 @bitriel/base authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@polkadot/dev/config/jest.cjs');

module.exports = {
  ...config,
  moduleNameMapper: {
    '@bitriel/base/(.*)$': '<rootDir>/packages/base/src/$1',
    '@bitriel/chain-services/(.*)$': '<rootDir>/packages/storage/src/$1',
    '@bitriel/controllers/(.*)$': '<rootDir>/packages/storage/src/$1',
    '@bitriel/keyring/(.*)$': '<rootDir>/packages/storage/src/$1',
    '@bitriel/networks/(.*)$': '<rootDir>/packages/storage/src/$1',
    '@bitriel/storage/(.*)$': '<rootDir>/packages/storage/src/$1',
    '@bitriel/stream/(.*)$': '<rootDir>/packages/storage/src/$1',
    '@bitriel/utils/(.*)$': '<rootDir>/packages/storage/src/$1',
    '@bitriel/web2-services/(.*)$': '<rootDir>/packages/storage/src/$1',
    '@bitriel/web3-services/(.*)$': '<rootDir>/packages/storage/src/$1'
  },
  testTimeout: 30000
};
