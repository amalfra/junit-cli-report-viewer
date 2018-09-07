#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var parseString = require('xml2js').parseString;

var packageJson = require('./package.json');
var lib = require('./lib');

program
  .version(packageJson.version, '-v, --version')
  .usage('<junit.xml file path...>');

program.parse(process.argv);

if (program.args.length < 1) {
  console.warn('A filepath must be provided');
  process.exit(1);
}

var filepath = program.args[0];
if (!fs.existsSync(filepath)) {
  console.warn('File does not exists in filepath provided');
  process.exit(1);
}
var xmlStr = fs.readFileSync(filepath, 'utf8');

parseString(xmlStr, function (err, result) {
  console.log();
  lib.printSummary(result.testsuites.$);
  console.log();
});
