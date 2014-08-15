var express      = require('express'),
    path         = require('path'),
    favicon      = require('static-favicon'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    net          = require('net'),
    bodyParser   = require('body-parser'),
    routes       = require('./routes/index'),
    Job          = require('./lib/models/job'),
    app          = express(),
    server;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server = net.createServer(function jobQueueHandler(socket) {
    socket.on('data', function (chunk) {
        var jsonData = {status:'unknown'};

        try {
            jsonData = JSON.parse(chunk.toString());

            switch (jsonData.action) {
              case 'put':
                Job.put(jsonData.namespace, jsonData.data, function putHandler(response) {
                  console.log("Put:Success:", response);
                  socket.write(JSON.stringify(response));
                });
                break;
              case 'get':
                Job.get(jsonData.namespace, function getHandler(response) {
                  console.log("Get:Success:", response);
                  socket.write(JSON.stringify(response));
                });
                break;
              case 'remove':
                Job.removeOne(jsonData.data.jobId, function removeHandler(response) {
                  console.log("Remove:Success:", response);
                  socket.write(JSON.stringify(response));
                });
                break;
              case 'remove_all':
                Job.removeAll(jsonData.namespace, function removeAllHandler(response) {
                  console.log("RemoveAll:Success:", response);
                  socket.write(JSON.stringify(response));
                });
            }
        } catch(err) {
            console.log(err);
        }

    });
});

server.listen(8200, function listenerHandler() {
  console.log('server bound');
});

app.listen(8000);

module.exports = app;
