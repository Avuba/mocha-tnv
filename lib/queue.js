var EventEmitter = require('events').EventEmitter,
  async = require('async'),
  util = require('util');



var Queue = function() {
  this.queue = [];
  this.finished = [];
  this.workers = [];
};


util.inherits(Queue, EventEmitter);


Queue.prototype.push = function(fileName) {
  this.queue.push(fileName);
};


Queue.prototype.addWorker = function(name, done) {
  this.workers.push({ name: name, done: done });
};


Queue.prototype.run = function(done) {
  var self = this;
  this.max = this.queue.length;


  async.whilst(
    function() {
      return self.finished.length !== self.max;
    },
    function(callback) {
      var worker = self.workers.pop(),
        fileName = self.queue.pop();

      if (worker && fileName) {
        worker.done(fileName, function(err) {
          if (err) callback(err);
          
          self.workers.push(worker);
          self.finished.push(fileName);
        });
      }

      // push worker back because no filename
      if (worker && !fileName) {
        self.workers.push(worker);
      }

      // push filename back if no worker
      if (fileName && !worker) {
        self.queue.push(fileName);
      }

      setTimeout(function() {
        return callback();
      }, 100);
    },
    function(err) {
      return done(err);
    }
  );
};


module.exports = Queue;