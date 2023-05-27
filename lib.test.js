import assert from 'assert';

import * as lib from './lib.js';
import parseString from 'xml2js';

const xmlStr = `
<?xml version="1.0" encoding="UTF-8" ?>
<testsuites>
 <testsuite name="someName" time="0.004" errors="0" tests="2" skipped="0" failures="1">
  <testcase classname="className" name="someName" time="0.002">
   <failure type="toBe" message="Expected 1 to be 2.">
   </failure>
  </testcase>
  <testcase classname="clasName2" name="someName2" time="0">
  </testcase>
 </testsuite>
</testsuites>
`;

describe('lib', () => {

  describe('from parsed XML', () => {
    let result, err;
    beforeEach((done) => {
      parseString.parseString(xmlStr, (outErr, outResult) => {
        result = outResult;
        err = outErr;
        done();
      });
    });
    it('should parse', () => {
      assert.equal(err, null);
    });
    it('should not throw with parsed XML', () => {
      if (!result.testsuites.$) {
        result.testsuites.$ = lib.findSummaryFromTestsuites(result.testsuites.testsuite);
      } else {
        result.testsuites.$ = {
          ...result.testsuites.$,
          ...lib.findSummaryFromTestsuites(result.testsuites.testsuite),
        };
      }
      assert.doesNotThrow(() => lib.generateSummary(result.testsuites.$));
      result.testsuites.testsuite.forEach(t => {
        assert.doesNotThrow(() => lib.generateTestsuiteSummary(t));
        assert.doesNotThrow(() => lib.generateTestsuiteResult(t));
      });
    });
  });
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
});
