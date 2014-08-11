var Mongoose = require('mongoose'),
  MD5        = require('MD5'),
  Job;

Mongoose.connect('mongodb://localhost/keppler-jq');

JobSchema = new Mongoose.Schema({
  namespace : String,
  jobId     : String,
  data      : {}
});

JobSchema.statics.get = function get(namespace, callback) {
  this.findOneAndRemove({namespace : namespace}, function findOneAndRemoveHandler(error, job) {
    var response = {};

    if (error || job === null) {
      response = {status : 'fail', message : 'not found'};
    }
    else if (job) {
      response = {status : 'success', jobId : job.jobId, data : job.data};
    }

    callback(response);
  });
};

JobSchema.statics.put = function put(namespace, data, callback) {
  var jobId = null, 
    date  = new Date(), 
    randomString, job, res;

  randomString = date.toISOString().split('').sort(function () {
    return 0.5 - Math.random()
  }).join();

  jobId = MD5(namespace + JSON.stringify(data) + randomString);

  job = new Job({
    namespace : namespace,
    jobId     : jobId,
    data      : data
  });

  job.save(function jobSaveHandler(error, job) {
    var response = {};

    if (error) {
      response = {status : "fail"}
    }
    else if (job && job.jobId === jobId) {
      response = {status : "success", jobId : jobId};  
    }

    callback(response);
  });
};

JobSchema.statics.removeOne = function removeOne(jobId, callback) {
  this.findOneAndRemove({jobId : jobId}, function findOneAndRemoveHandler(error, job) {
    var response = {};

    if (error || job === null) {
      response = {status : 'fail', message : 'not found'};
    } else if (job && job.jobId === jobId) {
      response = {status : 'success', jobId : job.jobId};
    }

    callback(response);
  });
};

JobSchema.statics.removeAll = function removeAll(namespace, callback) {
  var query = this.remove({namespace : 'query'}, function removeHandler(error, removedCount) {
    var response = {};

    if (error || removedCount === 0) {
      response = {status : 'fail', message : 'not found'};
    }
    else if (removedCount && removedCount > 0) {
      response = {status : 'success', count : removedCount};
    }

    callback(response);
  });
};

Job = Mongoose.model('Job', JobSchema);
module.exports = Job;