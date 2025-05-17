#!/usr/bin/env node

import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import program from 'commander';
import parseString from 'xml2js';

import * as lib from './lib.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

program
  .version(packageJson.version, '-v, --version')
  .option('--logs', 'include log output for test cases')
  .usage('<junit.xml file path...>');

program.parse(process.argv);

if (program.args.length < 1) {
  console.warn('A filepath must be provided');
  process.exit(1);
}

const options = program.opts();
const filepath = program.args[0];
if (!fs.existsSync(filepath)) {
  console.warn('File does not exists in filepath provided');
  process.exit(1);
}
const xmlStr = fs.readFileSync(filepath, 'utf8');

parseString.parseString(xmlStr, (err, result) => {
  if (err) {
    console.error('Failed to parse XML file');
    process.exit(1);
  }
  if (!result.testsuites?.$) {
    if (result.testsuite) {
      result.testsuites = {};
      result.testsuites.$ = lib.findSummaryFromTestsuites([result.testsuite]);
    } else {
      result.testsuites.$ = lib.findSummaryFromTestsuites(result.testsuites.testsuite);
    }
  } else {
    result.testsuites.$ = {
      ...result.testsuites.$,
      ...lib.findSummaryFromTestsuites(result.testsuites.testsuite),
    };
  }

  console.log(lib.generateSummary(result.testsuites.$));
  console.log();
  (result.testsuites?.testsuite || [result.testsuite]).forEach(t => {
    console.log(lib.generateTestsuiteSummary(t));
    console.log(lib.generateTestsuiteResult(t));
    if (options.logs) {
      console.log(lib.generateTestsuiteLogs(t));
    }
  });
});
