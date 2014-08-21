var Mongoose    = require('mongoose'),
    MD5         = require('MD5');

JobSchema = new Mongoose.Schema({
    namespace : String,
    jobId     : { type: String, index: { unique: true } },
    data      : {}
});

JobSchema.statics.fetch = function fetch(namespace, callback) {
    var self = this,
        parameters;

    parameters = {
        query   : {namespace : namespace},
        fields  : null,
        options : { sort : { _id : 'asc' } }
    };

    self.findOne(parameters.query, parameters.fields, parameters.options, function findOneAndRemoveHandler(error, job) {
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
    var self = this,
        parameters;

    parameters = {
        query   : {namespace : namespace},
        options : { sort : { _id : 'asc' } }
    };

    self.findOneAndRemove(parameters.query, parameters.options,
        function findOneAndRemoveHandler(error, job) {
            var response = {};

            if (error || job === null) {
                response = {status : 'fail', message : 'not found'};
            }
            else if (job) {
                response = {status : 'success', jobId : job.jobId, namespace : job.namespace, data : job.data};
            }

            if (callback) callback(error, response);
        }
    );
};

JobSchema.statics.getMultiple = function get(namespace, limit, callback) {
    var self = this,
        parameters;

    parameters = {
        query   : {namespace : namespace},
        fields  : null,
        options : { limit : limit, sort : { _id : 'asc' } }
    };

    self.find(parameters.query, parameters.fields, parameters.options,
        function findHandler(error, jobs) {
            var response = {};

            if (!error) {
                response = {status : 'success', jobs : jobs};
                var ids = jobs.map( function(job) { return job._id; } );
                self.find({_id: {$in: ids}}).remove( function(){
                    if (callback) callback(null, response);
                });
            } else {
                if (callback) callback(error);
            }
        }
    );
};

JobSchema.statics.put = function put(namespace, data, callback) {
    var self        = this,
        jobId       = null,
        jobParams;

    jobId = MD5(namespace + JSON.stringify(data));

    jobParams = {
        namespace : namespace,
        jobId     : jobId,
        data      : data
    };

    self.create(jobParams, function jobCreateHandler(error, job) {
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
    var self = this,
        parameters;

    parameters = {
        query   : { jobId : jobId },
        options : null
    };

    self.findOneAndRemove(parameters.query, parameters.options,
        function findOneAndRemoveHandler(error, job) {
            var response = {};

            if (error || job === null) {
                response = {status : 'fail', message : 'not found'};
            }
            else if (job && job.jobId === jobId) {
                response = {status : 'success', jobId : job.jobId};
            }

            if (callback) callback(error, response);
        }
    );
};

JobSchema.statics.removeAll = function removeAll(namespace, callback) {
    var self = this,
        parameters;

    parameters = {
        query   : {namespace : namespace},
        fields  : null,
        options : null
    };

    self.find(parameters.query, parameters.fields, parameters.options)
        .remove(function removeHandler(error, removedCount) {

            var response = {};

            if (error || removedCount === 0) {
                response = {status : 'fail', message : 'not found'};
            }
            else if (removedCount && removedCount > 0) {
                response = {status : 'success', count : removedCount};
            }

            if (callback) callback(error, response);
        }
    );
};

module.exports = JobSchema;