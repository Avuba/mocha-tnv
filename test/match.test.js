var lib = require(__dirname + '/../lib'),
  path = require('path'),
  chai = require('chai');


global.should = chai.should();
global.expect = chai.expect;
global.assert = chai.assert;


describe('UNIT: match', function() {
  it('exclude 1', function() {
    var root = path.normalize(__dirname + '/../');

    var matched = lib.match({
      applicationPath: root,
      files: [
        {
          fileName: 'create.test.js',
          path: root + '/test/unit/card/create.test.js'
        },
        {
          fileName: 'create.test.js',
          path: root + '/test/unit/user/create.test.js'
        }
      ],
      folder: 'unit',
      query: 'create',
      exclude: 'user'
    });

    matched.length.should.eql(1);
  });


  it('exclude 2', function() {
    var root = path.normalize(__dirname + '/../');

    var matched = lib.match({
      applicationPath: root,
      files: [
        {
          fileName: 'create.test.js',
          path: root + '/test/unit/card/create.test.js'
        },
        {
          fileName: 'create.test.js',
          path: root + '/test/unit/user/create.test.js'
        }
      ],
      query: 'create',
      exclude: 'user'
    });

    matched.length.should.eql(1);
  });


  it('exclude 2', function() {
    var root = path.normalize(__dirname + '/../');

    var matched = lib.match({
      applicationPath: root,
      files: [
        {
          fileName: 'create.test.js',
          path: root + '/test/integration/7-others/1-shutdown.test.js'
        },
        {
          fileName: 'create.test.js',
          path: root + '/test/integration/1-card/create.test.js'
        },
        {
          fileName: 'create.test.js',
          path: root + '/test/unit/middlewares/utils.test.js'
        }
      ],
      exclude: '7'
    });

    matched.length.should.eql(2);
  });


  it('without exclude', function() {
    var root = path.normalize(__dirname + '/../');

    var matched = lib.match({
      applicationPath: root,
      files: [
        {
          fileName: 'create.test.js',
          path: root + '/test/unit/card/create.test.js'
        },
        {
          fileName: 'create.test.js',
          path: root + '/test/unit/user/create.test.js'
        }
      ],
      query: 'create'
    });

    matched.length.should.eql(2);
  });
});