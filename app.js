
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var revisions = require('./routes/revisions');
var rewrites = require('./routes/rewrites');
var download = require('./routes/downloadsite');
var proxy = require("./routes/proxy");
var site = require('./routes/site');
var distort = require('response-distort')
var url = require('url')
//var compression = require('compression')
var fs = require('fs')


var compression = require('compression')
var express = require('express')
var app = express()
app.use(compression())



// compress all responses 
//app.use(compression())


var favicon = require('serve-favicon');

app.use(favicon(__dirname + '/public/favicon.ico'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }));
app.use(cookieParser());




//app.use('/', index);
app.use('/users', users);
app.use('/revisions', revisions);
app.use('/site', site);
app.use('/rewrites',rewrites);
app.use('/download',download);
app.use("/proxy",proxy);

process.env.HOMEDIR = path.join(__dirname);

process.env.SITEDIR = path.join(__dirname,"public","sites");

app.use(rewrites.SEOUrlFilter)

//Put before regular routes so they don't interfere
app.use(revisions.getRevision);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public','adminbootstrap')));
app.use(express.static(path.join(__dirname, 'public','sites')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
