/**
 * @license Avuba GmbH
 */


var path = require('path'),
  argv = require('optimist').argv,
  fs = require('fs'),
  lodash = require('lodash'),
  lib = require('./lib'),
  __private__ = {};


__private__.defaults = {
  processes: 2,
  testFilePostfix: /.test.js/gi,
  applicationPath: path.normalize(__dirname + '/../../'),
  testFolderPath: path.normalize(__dirname + '/../../test'),
  utilsPath: path.normalize(__dirname + '/../../test/utils'),
  nodeModulesPath: path.normalize(__dirname + '/../../node_modules'),
  database: 'test'
};


module.exports = function() {
  var config = argv.config,
    query = argv.query,
    exclude = argv.exclude,
    folder = argv.folder;

  if (config) {
    __private__.config = lodash.merge(__private__.defaults, JSON.parse(fs.readFileSync(config, { encoding: 'utf-8' })));
  }
  else {
    __private__.config = __private__.defaults;
  }

  var allFiles = lib.finder({ dir: __private__.config.testFolderPath }),
    matchedFiles = lib.match({
      applicationPath: __private__.config.applicationPath,
      files: allFiles,
      testFilePostFix: __private__.config.testFilePostfix,
      exclude: exclude,
      folder: folder,
      query: query
    });

  lib.runner.run({
    config: __private__.config,
    files: matchedFiles
  });
};