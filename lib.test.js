import assert from 'assert';
import { red, green, blue, bold } from 'colorette';

import * as lib from './lib.js';

describe('lib', () => {
  describe('generateSummary()', () => {
    const summary = {
      name: 'test',
      tests: 3,
      failures: 1,
      time: 123.3,
    };

    it('should generate correct summary name', () => {
      const expectedOutputName = `> Name:                         ${summary.name}`;
      assert.notEqual(lib.generateSummary(summary).indexOf(expectedOutputName), -1);
    });

    it('should generate correct summary total tests', () => {
      const expectedOutputTests = `> Total number of tests:        ${summary.tests}`;
      assert.notEqual(lib.generateSummary(summary).indexOf(expectedOutputTests), -1);
    });

    it('should generate correct summary failures', () => {
      const expectedOutputFailedTests = `> Total number of failed tests: ${summary.failures}`;
      assert.notEqual(lib.generateSummary(summary).indexOf(expectedOutputFailedTests), -1);
    });

    it('should generate correct summary time', () => {
      const expectedOutputTime = `> Total time:                   ${summary.time}`;
      assert.notEqual(lib.generateSummary(summary).indexOf(expectedOutputTime), -1);
    });
  });

  describe('findSummaryFromTestsuites()', () => {
    it('should generate when no results provided', () => {
      const expectedOutput = {
        errors: 0,
        skipped: 0,
        tests: 0,
        failures: 0,
        time: 0,
      };
      assert.deepEqual(lib.findSummaryFromTestsuites([]), expectedOutput);
    });

    it('should generate when results provided', () => {
      const testsuites = [
        {
          $: {
            name: 'JUnitXmlReporter1',
            errors: '1',
            tests: '1',
            failures: '3',
            time: '2.5',
            timestamp: '2013-05-24T10:23:58',
          },
        },
        {
          $: {
            name: 'JUnitXmlReporter2',
            errors: '1',
            tests: '1',
            failures: '3',
            time: '2.5',
            timestamp: '2013-05-24T10:23:58',
          },
        },
      ];
      const expectedOutput = {
        errors: 2,
        skipped: 0,
        tests: 2,
        failures: 6,
        time: 5,
      };
      assert.deepEqual(lib.findSummaryFromTestsuites(testsuites), expectedOutput);
    });
  });

  describe('generateTestsuiteSummary()', () => {
    const tests = [
      {
        title: 'should correctly display passing test suites',
        summary: {
          name: 'Passing Suite',
          time: '2.5',
          tests: '1',
          errors: '0',
          failures: '0',
          skipped: '0',
        },
        expectedPrefix: `${bold(green('PASS'))}`,
      },
      {
        title: 'should correctly display failing test suites',
        summary: {
          name: 'Failing Suite',
          time: '2.5',
          tests: '1',
          errors: '0',
          failures: '1',
          skipped: '0',
        },
        expectedPrefix: `${bold(red('FAIL'))}`,
      },
      {
        title: 'should correctly display erroring test suites',
        summary: {
          name: 'Erroring Suite',
          time: '2.5',
          tests: '1',
          errors: '1',
          failures: '0',
          skipped: '0',
        },
        expectedPrefix: `${bold(red('FAIL'))}`,
      },
      {
        title: 'should correctly display skipped test suites',
        summary: {
          name: 'Skipped Suite',
          time: '2.5',
          tests: '1',
          errors: '0',
          failures: '0',
          skipped: '1',
        },
        expectedPrefix: `${bold(blue('SKIP'))}`,
      },
    ];

    for (const test of tests) {
      it(test.title, () => {
        const testSuite = {
          $: test.summary,
        };
        const expected = ` ${test.expectedPrefix} ${test.summary.name} (${test.summary.time})`;
        assert.deepEqual(lib.generateTestsuiteSummary(testSuite), expected);
      });
    }
  });
});
