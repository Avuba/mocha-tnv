var lodash = require('lodash');


module.exports = function(options) {
  var files = options.files,
    isTestFile = options.isTestFile,
    match = options.match || null,
    matched = [];


  lodash.find(files, function(file) {
    if (isTestFile(file) && file.match(match)) {
      matched.push(file);
    }
  });

  return matched;
};