'use strict';

/**
 * Main application file
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');

var app = express();

// connect to DB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

app.get('/test', function(req, res){
  res.send('test page');
});
require('./config/express')(app);
require('./routes')(app);

const server = require('http').createServer(app);
server.listen(config.port, function() {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

