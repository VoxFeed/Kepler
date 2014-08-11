require('neon');

var net = require('net');

Class("KeplerApi")({
    prototype : {

        get : function get(namespace, callback) {
            this._request("get", namespace, null, callback);
        },

        put : function put(namespace, job, callback) {
            this._request("put", namespace, job, callback);
        },

        remove : function remove(jobId, callback) {
            this._request("remove", null, {jobId : jobId}, callback);
        },

        removeAll : function removeAll(namespace, callback) {
            this._request("remove_all", namespace, null, callback);
        },

        _request : function(action, namespace, job, callback) {
            var socket  = new net.Socket();

            socket.on("connect", function() {
                socket.write(JSON.stringify({action: action, namespace: namespace, data: job}));

                socket.on("data", function (data) {
                    var jsonData = {status:'unknown'};
                    console.log("Reading :", data.toString());
                    try {
                        jsonData = JSON.parse(data.toString());
                        callback(jsonData);
                    } catch(err) {
                        console.log(err);
                    }
                });

                socket.on("error", function (err) {
                    console.log("there was an error", err);
                });
            });

            socket.connect(8200, 'localhost');
        }
    }
});

module.exports = KeplerApi;