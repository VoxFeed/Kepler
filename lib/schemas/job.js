var Mongoose    = require('mongoose'),
    MD5         = require('MD5');

JobSchema = new Mongoose.Schema({
    namespace : String,
    jobId     : { type: String, index: { unique: true } },
    data      : {}
});

JobSchema.statics.fetch = function fetch(namespace, callback) {
    this.findOne({namespace : namespace}, function findOneAndRemoveHandler(error, job) {
        var response = {};

        if (error || job === null) {
            response = {status : 'fail', message : 'not found'};
        }
        else if (job) {
            response = {status : 'success', jobId : job.jobId, namespace : job.namespace, data : job.data};
        }

        if (callback) callback(error, response);
    });
};

JobSchema.statics.get = function get(namespace, callback) {
    this.findOneAndRemove({namespace : namespace}, function findOneAndRemoveHandler(error, job) {
        var response = {};

        if (error || job === null) {
            response = {status : 'fail', message : 'not found'};
        }
        else if (job) {
            response = {status : 'success', jobId : job.jobId, namespace : job.namespace, data : job.data};
        }

        if (callback) callback(error, response);
    });
};

JobSchema.statics.put = function put(namespace, data, callback) {
    var jobId       = null,
        jobParams;

    jobId = MD5(namespace + JSON.stringify(data));

    jobParams = {
        namespace : namespace,
        jobId     : jobId,
        data      : data
    };

    this.create(jobParams, function jobCreateHandler(error, job) {
        var response = {};

        if (error) {
            response = {status : "fail", details : error}
        }
        else if (job && job.jobId === jobId) {
            response = {status : "success", jobId : jobId};
        }

        if (callback) callback(error, response);
    });
};

JobSchema.statics.remove = function remove(jobId, callback) {
    this.findOneAndRemove({jobId : jobId}, function findOneAndRemoveHandler(error, job) {
        var response = {};

        if (error || job === null) {
            response = {status : 'fail', message : 'not found'};
        } else if (job && job.jobId === jobId) {
            response = {status : 'success', jobId : job.jobId};
        }

        if (callback) callback(error, response);
    });
};

JobSchema.statics.removeAll = function removeAll(namespace, callback) {
    this.find({namespace : namespace}).remove(function removeHandler(error, removedCount) {

        var response = {};

        if (error || removedCount === 0) {
            response = {status : 'fail', message : 'not found'};
        }
        else if (removedCount && removedCount > 0) {
            response = {status : 'success', count : removedCount};
        }

        if (callback) callback(error, response);
    });
};

module.exports = JobSchema;