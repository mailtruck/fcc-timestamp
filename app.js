var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

var moment = require('moment');

var validTimestamp = function(str){
  return str.split('').every(function(n){
    return parseInt(n) == n;
  });
};

var processInput = function(reqUrl){
  console.log(typeof reqUrl);
  var arg = decodeURI(reqUrl.substr(1));
  var momentObj = moment(arg);
  var responseDate = {
    "unix": null,
    "natural": null
  };

  if (arg == 'now') momentObj = moment();

  if(validTimestamp(arg)){
    //responseDate.url = input;
    responseDate.unix = parseInt(arg);
    responseDate.natural = moment(responseDate.unix*1000).format('LL');
  }
  else if (momentObj.isValid()){
  responseDate.natural = momentObj.format('LL');
  responseDate.unix = momentObj.unix();
  }

  return responseDate;
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('*', users);
app.get('*', function(req, res){
  var myDate = Date.now();
  myDate.unix = myDate;
  res.json(processInput(req.url));
});


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
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
