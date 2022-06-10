#!/usr/bin/env node

var program = require('commander');

program
  .version('0.0.2')
  .command('init [name]', 'add ')
  .command('import [token]', 'search with optional query')
  .parse(process.argv);
