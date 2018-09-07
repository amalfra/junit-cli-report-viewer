var columnify = require('columnify');

exports.printSummary = function (summary) {
  var data = {
    '> Name:': summary.name,
    '> Total number of tests:': summary.tests,
    '> Total number of failed tests:': summary.failures,
    '> Total time:': summary.time,
  };
  var columns = columnify(data, {
    showHeaders: false,
  });
  console.log(columns);
};
