var lodash = require('lodash');


module.exports = function(options) {
  var files = options.files,
    testFilePostFix = options.testFilePostFix,
    query = options.query || /\w+/gi,
    matched = [];

  lodash.find(files, function(object) {
    var fileName = object.fileName,
      path = object.path;

    if (fileName.match(testFilePostFix) && fileName.match(query)) {
      matched.push(path);
    }
  });

  return matched;
};