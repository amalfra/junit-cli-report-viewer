const assert = require('assert');

const lib = require('./lib');

describe('lib', () => {
  describe('generateSummary()', () => {
    const summary = {
      name: 'test',
      tests: 3,
      failures: 1,
      time: 123.3
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
});
