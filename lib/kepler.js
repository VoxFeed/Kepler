var jobSchema   = require('./schemas/job.js'),
    Mongoose    = require('mongoose');
                  require('neon');

Class("Kepler")({
    DATABASE_NAME : 'kepler-jq',

    prototype : {

        init : function init(mongoConnectionParams){
            var mongoConnectionUri,
                connection;

            // Build Uri
            mongoConnectionUri = 'mongodb://';

            if (mongoConnectionParams.user && mongoConnectionParams.password) {
                mongoConnectionUri += mongoConnectionParams.user + ':' + mongoConnectionParams.password + '@';
            }

            mongoConnectionUri += mongoConnectionParams.host;

            if (mongoConnectionParams.port) {
                mongoConnectionUri += ':' + mongoConnectionParams.port;
            }

            mongoConnectionUri += '/' + Kepler.DATABASE_NAME;

            // Connect to mongo
            connection = Mongoose.createConnection(mongoConnectionUri);

            this.Job = connection.model('Job', jobSchema);

            return this;
        },

        fetch : function fetch(namespace, callback) {
            this.Job.fetch(namespace, callback);
        },

        get : function get(namespace, callback) {
            this.Job.get(namespace, callback);
        },

        put : function put(namespace, data, callback) {
            this.Job.put(namespace, data, callback);
        },

        remove : function remove(jobId, callback) {
            this.Job.remove(jobId, callback);
        },

        removeAll : function removeAll(namespace, callback) {
            this.Job.removeAll(namespace, callback);
        }

    }
});

module.exports = Kepler;