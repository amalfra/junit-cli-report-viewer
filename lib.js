const columnify = require('columnify');
const { red, green, bold } = require('colorette');
const logSymbols = require('log-symbols');

exports.printSummary = (summary) => {
  const data = {
    '> Name:': summary.name,
    '> Total number of tests:': summary.tests,
    '> Total number of failed tests:': summary.failures,
    '> Total time:': summary.time,
  };
  const columns = columnify(data, {
    showHeaders: false,
  });
  console.log(columns);
};

const isTestsuiteSuccess = (summary) => {
  return parseInt(summary.errors) === 0 && parseInt(summary.failures) === 0;
};

const isTestcaseSuccess = (testcase) => {
  return testcase.failure === undefined;
};

const printTestcaseResult = (testcase) => {
  if (isTestcaseSuccess(testcase)) {
    console.log(`   ${logSymbols.success} `, testcase.$.name);
  } else {
    console.log(`   ${logSymbols.error} `, testcase.$.name);
  }
};

exports.printTestsuiteResult = (suiteResult) => {
  const summary = suiteResult.$;
  let summaryParagraph = '';
  if (isTestsuiteSuccess(summary)) {
    summaryParagraph += ` ${bold(green('PASS'))} ${summary.name}`;
  } else {
    summaryParagraph += ` ${bold(red('FAIL'))} ${summary.name}`;
  }
  summaryParagraph += ` (${summary.time})`;

  console.log(summaryParagraph);

  const testscases = suiteResult.testcase;
  testscases.forEach(printTestcaseResult);
};
