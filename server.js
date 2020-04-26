const express = require("express");
const bodyparser = require("body-parser");
const app = express();
var http = require('http');
var models = require('./models')
var debug = require('debug')('enterprise-configurator-server:server');
var path = require('path');
const dotenv = require('dotenv').config();
var cors = require('cors');
var fs = require('fs');
var rfs = require('rotating-file-stream');
var logger = require('morgan');
var createError = require('http-errors');
var indexRouter = require('./routes/index');


var port = process.env.PORT || '3000';
app.set('port', port);
var server = http.createServer(app);

var logDirectory = path.join(__dirname, 'log');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = rfs('enterprise.log', {
  interval: '1d', // rotate daily
  path: logDirectory,
  maxFiles: 30,
})
//let logFormat = '{"remote_addr": ":remote-addr", "remote_user": ":remote-user", "date": ":date[web]", "method": ":method", "url": ":url", "http_version": ":http-version", "status": ":status", "result_length": ":res[content-length]", "referrer": ":referrer", "user_agent": ":user-agent", "response_time": ":response-time"}'
let loggerFormat = '[:date[web]] :remote-addr :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time'
// setup the logger
app.use(logger(loggerFormat, { stream: accessLogStream }))

//app.use(express.static(__dirname + '/dist/msas'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyparser.json({ limit: '1mb' }));
app.use(bodyparser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST,PUT,DELET');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,sessionid,email,multipart/form-data,application/x-www-form-urlencoded');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(function (req, res, next) {
  res.locals.url = req.protocol + '://' + req.headers.host + req.url;
  next();
})
/*********Log the api******** */
const getLoggerForStatusCode = (statusCode) => {
  if (statusCode >= 500) {
    return console.error.bind(console)
  }
  if (statusCode >= 400) {
    return console.warn.bind(console)
  }

  return console.log.bind(console)
}

const logRequestStart = (req, res, next) => {

  const cleanup = () => {
    res.removeListener('finish', logFn)
    res.removeListener('close', abortFn)
    res.removeListener('error', errorFn)
  }

  const logFn = () => {
    cleanup()
    const logger = getLoggerForStatusCode(res.statusCode)
    logger(`${req.method} ${req.originalUrl}  ${res.statusCode} ${res.statusMessage};`)
  }

  const abortFn = () => {
    cleanup()
    console.warn('Request aborted by the client')
  }

  const errorFn = err => {
    cleanup()
    console.error(`Request pipeline error: ${err}`)
  }

  res.on('finish', logFn) 
  res.on('close', abortFn) 
  res.on('error', errorFn) 

  next()
}

app.use(logRequestStart)
app.disable('etag');


/*****Routes**** */
app.use('/api/v1', indexRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
  res.status(404).send("Server is down")
});


models.sequelize.sync().then(function () {
  console.log("STARTING IN SERVER:")
  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port, function () {
    console.log("EC SERVER LISTENING ON PORT :", port)
    debug('Express server listening on port ' + server.address().port);
  });
  server.on('error', onError);
  server.on('listening', onListening);
}).catch(error => {
  console.log("ERROR while syncing with sequelize:", error)
});


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    case 'UnhandledPromiseRejectionWarning':
      console.error('Server is down');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


//https.createServer({},app).listen(443);
console.log('Server Started : ' + port);




