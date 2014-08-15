var jobSchema   = require('./schemas/job.js'),
    Mongoose    = require('mongoose');
                  require('neon');

Class("KeplerApi")({
    DATABASE_NAME : 'kepler-jq',

    prototype : {

        init : function init(mongoConnectionParams){
            var mongoConnectionUri = 'mongodb://';


            // Build Uri
            if (mongoConnectionParams.user && mongoConnectionParams.password) {
                mongoConnectionUri += mongoConnectionParams.user + ':' + mongoConnectionParams.password + '@';
            }

            mongoConnectionUri += mongoConnectionParams.host;
            
            if (mongoConnectionParams.port) {
                mongoConnectionUri += ':' + mongoConnectionParams.port;
            }

            mongoConnectionUri += '/' + KepplerApi.DATABASE_NAME;

            // Connect to mongo
            Mongoose.connect(mongoConnectionUri);

            this.Job = Mongoose.model('Job', jobSchema);
            
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

module.exports = KeplerApi;