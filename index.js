#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const parseString = require('xml2js').parseString;

const packageJson = require('./package.json');
const lib = require('./lib');

program
  .version(packageJson.version, '-v, --version')
  .usage('<junit.xml file path...>');

program.parse(process.argv);

if (program.args.length < 1) {
  console.warn('A filepath must be provided');
  process.exit(1);
}

const filepath = program.args[0];
if (!fs.existsSync(filepath)) {
  console.warn('File does not exists in filepath provided');
  process.exit(1);
}
const xmlStr = fs.readFileSync(filepath, 'utf8');

parseString(xmlStr, (err, result) => {
  console.log();
  lib.printSummary(result.testsuites.$);
  console.log();
  result.testsuites.testsuite.forEach(t => {
    lib.printTestsuiteResult(t);
  });
});
