#!/usr/bin/env node

'use strict';
require = require('esm')(module /*, options*/);

var currentNodeVersion = process.versions.node;
var semver = currentNodeVersion.split('.');
var major = semver[0];

if (major < 8) {
  console.error(
    'You are running Node ' +
      currentNodeVersion +
      '.\n' +
      'Create React App requires Node 8 or higher. \n' +
      'Please update your version of Node.'
  );
  process.exit(1);
}

console.log('Asdsadasds');

require('./createShopifyTheme');
