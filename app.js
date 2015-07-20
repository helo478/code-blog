var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

// default to a localhost configuration:
var connection_string = 'mongodb://127.0.0.1/code-blog';

// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect(connection_string);

/*
if (process.env.OPENSHIFT_MONGO_DB_URL) {
  var mongoPath = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/code-blog';
  var mongoUserName = process.env.OPENSHIFT_MONGODB_USER_NAME || "";
  var mongoPassword = process.env.OPENSHIFT_MONGODB_PASSWORD || "";
  var mongoHost = process.env.OPENSHIFT_MONGODB_HOST || "127.0.0.1";
  var mongoPort = process.env.OPENSHIFT_MONGODB_PORT || 7070;

  var mongoPath = 'mongodb://' + mongoHost + ':' + mongoPort + '/' +
}
else {
  var mongoPath = 'mongodb://localhost/code-blog';
}
mongoose.connect(mongoPath);
*/

var routes = require('./routes/index');
var createAccount = require('./routes/createAccount');
var logIn = require('./routes/logIn');
var users = require('./routes/users');
var things = require('./routes/things');
var blogs = require('./routes/blogs');

var app = express();

// set up image serving
app.use('/public', express.static(__dirname + '/public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/createAccountButton', createAccount);
app.use('/logIn', logIn);
app.use('/users', users);
app.use('/things', things);
app.use('/blogs', blogs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
// no stacktraces leaked to users
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
