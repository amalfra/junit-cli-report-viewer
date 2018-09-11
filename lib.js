const columnify = require('columnify');
const { red, green, bold } = require('colorette');

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

const isSuccess = (summary) => {
  return summary.errors === 0 && summary.failures === 0;
};

exports.printTestsuiteResult = (suiteResult) => {
  const summary = suiteResult.$;
  if (isSuccess(summary)) {
    console.log(` ${bold(green('PASS'))} `, summary.name);
  } else {
    console.log(` ${bold(red('FAIL'))} `, summary.name);
  }
};
