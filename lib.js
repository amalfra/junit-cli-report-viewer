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
      errorLines = testcase.failure.map(f => f._).join(EOL).split(EOL).join(EOL + '\t');
    } else {
      errorLines = testcase.failure.map(f => f._);
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
  let result = [];
  const testscases = suiteResult.testcase;

  if (testscases) {
    let errLogs = [...testscases.map(testcase => testcase["system-err"] ? testcase["system-err"].join(EOL).split(EOL).join(EOL + '\t') : "")].filter(a => a != "");
    if (errLogs.length) {
      result.push(EOL, "   > Error Log output:", EOL, EOL, '\t', ...errLogs)
    }

    let outLogs = [...testscases.map(testcase => testcase["system-out"] ? testcase["system-out"].join(EOL).split(EOL).join(EOL + '\t') : "" )].filter(a => a != "")
    if (outLogs.length) {
      result.push(EOL, "   > Standard Log output:", EOL, EOL, '\t', ...outLogs)
    }
  }

  return result.join('');
};
