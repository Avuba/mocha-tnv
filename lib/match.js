var lodash = require('lodash');


module.exports = function(options) {
  var files = options.files,
    applicationPath = options.applicationPath,
    testFilePostFix = options.testFilePostFix,
    query = options.query || /\w+/gi,
    folder = options.folder,
    matched = [];

  lodash.find(files, function(object) {
    var fileName = object.fileName,
      path = object.path;


    if (fileName.match(testFilePostFix)) {
      // CASE: search in folder only
      if (folder) {
        var subPath  = path.split(applicationPath)[1].split('/').slice(0, -1).join('/');

        if (subPath.match(folder)) {
          if (fileName.match(query)) {
            matched.push(path);
          }
        }
      }
      // CASE: search everywhere
      else {
        if (fileName.match(query)) {
          matched.push(path);
        }
      }
    }
  });

  return matched;
};