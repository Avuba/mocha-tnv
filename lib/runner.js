var child_process = require('child_process'),
  async = require('async'),
  fs = require('fs'),
  lodash = require('lodash'),
  moment = require('moment'),
  Queue = require('./queue'),
  path = require('path'),
  __private__ = {
    startDate: null,
    port: 5010,
    stdErr: '',
    collectedErr: ''
  };




__private__.addProcess = function(number, queue) {
  var processVars = {
    env: {
      NODE_ENV: process.env.NODE_ENV || 'test',
      NODE_PORT: __private__.port + number,
      NODE_PROCESSNAME: number,
      NODE_DBNAME: process.env.NODE_DBNAME || (__private__.config.database + '-' + number),
      NODE_JOBNAME: 'testFile'
    }
  };


  lodash.each(process.env, function(value, key) {
    if (!processVars.env[key]) processVars.env[key] = value;
  });


  queue.addWorker(processVars.env.NODE_PROCESSNAME, function(fileName, done) {
    var tmpPath = __private__.config.nodeModulesPath + '/mocha-tnv/.tmp',
      mochaPath = __private__.config.nodeModulesPath + '/mocha/bin/mocha',
      coverFile = tmpPath + '/cover_single_' + moment.utc().unix() + Math.round(Math.random() * 1000) + '.js',
      mochaArgs = ['--reporter', 'spec', '--timeout', '100000', coverFile];


    processVars.env.NODE_TESTFILE = fileName.substring(fileName.lastIndexOf('/') + 1, fileName.lastIndexOf('.test.js'));

    if (!fs.existsSync(tmpPath)) {
      fs.mkdirSync(tmpPath);
    }

    var template = 'var fs = require("fs"); var utilsPath = "{{ UTILS-PATH }}"; var tnv = require(utilsPath); var copyOfDescribe = describe; describe = function(title, done) { copyOfDescribe(title, function() { return done.call(this, tnv); }); }; require("{{ FILENAME }}");';
    template = template.replace('{{ FILENAME }}', fileName);
    template = template.replace('{{ UTILS-PATH }}', __private__.config.utilsPath);

    fs.writeFile(coverFile, template, function(err) {
      if (err) return done(err);

      var collectedOut = '',
        spawned = child_process.spawn(mochaPath, mochaArgs, processVars);

      spawned.stdout.on('data', function(data) {
        if (__private__.files.length === 1) {
          process.stdout.write(data);
        }
        else {
          collectedOut += data;
        }
      });

      spawned.stderr.on('data', function(data) {
        if (__private__.files.length === 1) {
          process.stdout.write(data);
        }
        else {
          __private__.stdErr += data;
          collectedOut += data;
        }
      });

      spawned.on('close', function(code, data) {
        if (__private__.files.length !== 1) {
          process.stdout.write(collectedOut);
        }

        fs.unlink(coverFile, done);
      });
    });
  });
};




__private__.shutdown = function() {
  var endMoment = moment.utc();

  console.log('\n==================');
  console.log('%s total test time: %s, using %s processes', endMoment.format('HH:mm:ss'), endMoment.subtract(__private__.startDate).format('HH:mm:ss'), __private__.config.processes);
  console.log('==================');

  if (__private__.stdErr.length && __private__.files.length > 1) {
    process.stdout.write(__private__.stdErr);
    process.kill();
  }
};


// for each 'kill' process event be sure to call shutdown so kue is closed 'clean'
lodash.forEach(['SIGINT'], function(sigName) {
  process.on(sigName, function() {
    __private__.shutdown();
  });
});


/**
 * main logic:
 *
 * - put current test files as jobs in queue
 * - create workers (as number of processes to use) to listen for the above jobs.
 * - let workers do their stuff
 */
exports.run = function(options) {
  var files = options.files,
    config = options.config,
    queue = new Queue();

  __private__.config = config;
  __private__.files = files;

  async.waterfall([
    function(mainAsyncDone) {
      async.each(files, function(fileName, eachDone) {
        queue.push(fileName);
        return eachDone();
      }, function() {
        return mainAsyncDone();
      });
    },

    function(mainAsyncDone) {
      __private__.startDate = moment.utc();
      console.log('%s running tests using %s processes', __private__.startDate.format('HH:mm:ss'), __private__.config.processes);

      lodash.each(lodash.range(__private__.config.processes), function(number) {
        __private__.addProcess(number, queue);
      });

      return mainAsyncDone();
    }
  ], function(asyncErr) {
    if (asyncErr) {
      console.log('mochaRun async waterfall err?', asyncErr);
      return __private__.shutdown();
    }

    // start queueing
    queue.run(function(err) {
      if (err) console.log(err);
      __private__.shutdown();
    });
  });
};