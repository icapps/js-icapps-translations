#! /usr/bin/env node
var program = require('commander');
var importTranslations = require('../lib').import;

const DEFAULTS = {
  apiUrl: 'https://translate.icapps.com/api/project',
  languages: 'en',
};

program
  .version('0.0.1')
  .option('-i, --id <projectId>', 'unique project id')
  .option('-l, --languages <languages>', 'comma seperated list of languages')
  .option('-t, --token <token>', 'apiToken authentication token')
  .option('--api-url <apiUrl>', 'api url to fetch translations from.' +
           ` Default: ${DEFAULTS.apiUrl}`, DEFAULTS.apiUrl)
  .option('--destination <destination>', 'translations destionation path')
  .option('--clean', 'clean import, delete all translations before writing new')
  .option('--verbose', 'get more detailed information on what is happening')
  .parse(process.argv);


importTranslations(
  program.opts().apiUrl,
  program.opts().token,
  program.opts().id,
  program.opts().languages,
  {
    destination: program.opts().destination,
    clean: program.opts().clean,
    verbose: program.opts().verbose,
  }
);
