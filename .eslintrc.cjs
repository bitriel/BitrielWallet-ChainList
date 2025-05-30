// Copyright 2019-2022 @bitriel/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

const base = require('@polkadot/dev/config/eslint.cjs');

module.exports = {
  ...base,
  ignorePatterns: [
    ...base.ignorePatterns,
    "scripts/**/*.js",
    "i18next-scanner.config.js",
    "bitriel-*.mjs",
  ],
  parserOptions: {
    ...base.parserOptions,
    project: [
      './tsconfig.eslint.json'
    ]
  },
  rules: {
    ...base.rules,
    'header/header': [2, 'line', [
      { pattern: ' Copyright 20(17|18|19|20|21|22)(-2022)? (@polkadot|@bitriel)/' },
      ' SPDX-License-Identifier: Apache-2.0'
    ], 2],
    // this seems very broken atm, false positives
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'sort-keys': 'off'
  }
};
