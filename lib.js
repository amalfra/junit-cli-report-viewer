import logSymbols from 'log-symbols';
import columnify from 'columnify';
import { red, green, bold } from 'colorette';
import { EOL } from 'os';

export const generateSummary = (summary) => {
  const data = {
    '> Name:': summary.name,
    '> Total number of tests:': summary.tests,
    '> Total number of failed tests:': summary.failures,
    '> Total time:': summary.time,
  };
  const columns = columnify(data, {
    showHeaders: false,
  });
  return columns;
};

export const findSummaryFromTestsuites = (testsuites) => {
  const result = {
    errors: 0,
    skipped: 0,
    tests: 0,
    failures: 0,
    time: 0,
  };

  testsuites.forEach(t => {
    Object.keys(result).forEach(k => {
      if (t.$[k]) {
        result[k] += parseFloat(t.$[k]);
      }
    });
  });

  return result;
};

const isTestsuiteSuccess = (summary) => {
  const errors = parseInt(summary.errors, 10);
  const failures = parseInt(summary.failures, 10);
  return (isNaN(errors) || errors === 0) && (isNaN(failures) || failures === 0);
};

const isTestcaseSuccess = (testcase) => {
  return testcase.failure === undefined;
};

const generateTestcaseResult = (testcase) => {
  let resultParagraph = '';

  if (isTestcaseSuccess(testcase)) {
    resultParagraph += `   ${logSymbols.success} ${testcase.$.name}`;
  } else {
    resultParagraph += `   ${logSymbols.error} ${testcase.$.name}`;
  }
  resultParagraph += ` (${testcase.$.time})`;

  if (!isTestcaseSuccess(testcase)) {
    let errorLines = '';
    if (testcase.failure.join) {
      errorLines = testcase.failure.map(f => f['$'] && f['$'].message ? f['$'].message : f['_'])
        .join(EOL).split(EOL).join(EOL + '\t');
    } else {
      errorLines = testcase.failure['$'] && testcase.failure['$'].message ?
        testcase.failure['$'].message : testcase.failure['_'];
    }

    resultParagraph += EOL + '\t' + errorLines;
  }

  return resultParagraph;
};

export const generateTestsuiteSummary = (suiteResult) => {
  const summary = suiteResult.$;
  let summaryParagraph = '';
  if (isTestsuiteSuccess(summary)) {
    summaryParagraph += ` ${bold(green('PASS'))} ${summary.name}`;
  } else {
    summaryParagraph += ` ${bold(red('FAIL'))} ${summary.name}`;
  }
  summaryParagraph += ` (${summary.time})`;

  return summaryParagraph;
};

export const generateTestsuiteResult = (suiteResult) => {
  let result = [];
  const testscases = suiteResult.testcase;

  if (testscases) {
    result = testscases.map(testcase => generateTestcaseResult(testcase));
  }

  return result.join(EOL);
};

export const generateTestsuiteLogs = (suiteResult) => {
  const result = [];
  const testscases = suiteResult.testcase;

  if (testscases) {
    const errLogs = testscases.map(testcase => formatLogLine(testcase['system-err'])).filter(a => a);
    if (errLogs.length) {
      result.push(`   ${logSymbols.info} Error Log output:`, EOL, '\t', ...errLogs);
    }

    const outLogs = testscases.map(testcase => formatLogLine(testcase['system-out'])).filter(a => a);
    if (outLogs.length) {
      if (!result[result.length - 1].endsWith('\n')) {
        result.push('\n');
      }
      result.push(`   ${logSymbols.info} Standard Log output:`, EOL, '\t', ...outLogs);
    }
  }

  return result.join('');
};

const formatLogLine = (log = '') => {
  if (log.join) {
    return log.join(EOL).split(EOL).join(EOL + '\t');
  }
  return log;
};
