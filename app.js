/**
 * Module dependencies.
 */

var express = require('express')
, app    = require('express').createServer()
, routes = require('./routes')
, socket = require('./socket.js');


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/:uid?', routes.index);

socket.listen(app);
app.listen(3000);
console.log("Express server listening on port %d in %s mode",
            app.address().port, app.settings.env);
