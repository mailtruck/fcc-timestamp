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
  var strArr = str.split('');
  return strArr.every(function(n){
    console.log(n);
    return parseInt(n) == n ;

  });
}

var processInput = function(reqUrl){
  console.log(typeof reqUrl);
  var arg = decodeURI(reqUrl.substr(1));

  console.log(validTimestamp(arg));
  var convertedInt = parseInt(arg);
  var momentObj = moment(arg);
  var responseDate = {
    "unix": null,
    "natural": null
  };

  console.log('pre if else');
  console.log(arg);
  console.log(convertedInt);
  console.log(momentObj);
  console.log(responseDate);
  if (arg == 'now') momentObj = moment();
  console.log('*******');
  console.log(responseDate.unix);
  console.log('*******');
  console.log(arg);
  if(validTimestamp(arg)){
    console.log('input.converted isInteger');
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
  console.log(req.url)

});


//hello


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
