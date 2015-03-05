/**
 * @license Avuba GmbH
 */


var path = require('path'),
  argv = require('optimist').argv,
  fs = require('fs'),
  lodash = require('lodash'),
  lib = require('./lib'),
  __private__ = {};


__private__.config = {
  processes: 2,
  testFilePostfix: /.test/gi,
  applicationPath: path.normalize(__dirname + '/../../'),
  testFolderPath: path.normalize(__dirname + '/../../test'),
  utilsPath: path.normalize(__dirname + '/../../test/utils.js'),
  nodeModulesPath: path.normalize(__dirname + '/../../node_modules')
};


module.exports = function() {
  if (argv.config) {
    __private__.config = lodash.merge(__private__.config, JSON.parse(fs.readFileSync(argv.config, { encoding: 'utf-8' })));
  }

  var files = lib.match({
    files: lib.finder({ dir: __private__.config.testFolderPath }),
    testFilePostFix: __private__.config.testFilePostfix,
    query: argv.query
  });

  lib.runner.run({
    config: __private__.config,
    files: files
  });
};