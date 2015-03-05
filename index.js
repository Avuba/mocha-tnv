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
  utilsPath: path.normalize(__dirname + '/../../test/utils.js'),
  nodeModulesPath: path.normalize(__dirname + '/../../node_modules')
};


module.exports = function() {
  var config = argv.config,
    query = argv.query,
    folder = argv.folder;

  if (config) {
    __private__.config = lodash.merge(__private__.defaults, JSON.parse(fs.readFileSync(config, { encoding: 'utf-8' })));
  }

  var files = lib.match({
    applicationPath: __private__.config.applicationPath,
    files: lib.finder({ dir: __private__.config.testFolderPath }),
    testFilePostFix: __private__.config.testFilePostfix,
    folder: folder,
    query: query
  });

  lib.runner.run({
    config: __private__.config,
    files: files
  });
};