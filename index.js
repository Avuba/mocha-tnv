/**
 * @license Avuba GmbH
 */


var path = require('path'),
  argv = require('optimist').argv,
  fs = require('fs'),
  lodash = require('lodash'),
  runner = require('./lib/runner'),
  __private__ = {};


__private__.config = {
  processes: 2,
  applicationPath: path.normalize(__dirname + '/../../'),
  testPath: path.normalize(__dirname + '/../../test'),
  utilsPath: path.normalize(__dirname + '/../../test/utils.js'),
  nodeModulesPath: path.normalize(__dirname + '/../../node_modules'),
};


// tnv --config= --query=*
// tnv --config= --query=example
// tnv --config= --folder=1 --query=*
// tnv --config= --query=*


module.exports = function() {
  if (argv.config) {
    __private__.config = lodash.merge(__private__.config, JSON.parse(fs.readFileSync(argv.config, { encoding: 'utf-8' })));
  }

  runner.run({
    config: __private__.config,
    files: argv._
  });
};