var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var cryptoCompare = require('./routes/CryptoCompare/cryptoCompare')

const connection=require('./routes/connection')
const id=require('./routes/constants').id
const network=require('./routes/constants').network
const CryptoSocket=require('./routes/CryptoCompare/CryptoSocket')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/cc',cryptoCompare);


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



// /* socket  to communicate with client */
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3002);


var cryptoSocketList={}
io.on('connection',(client_socket)=>{
  console.log('there was a connection')
  
  client_socket.on('po',(data)=>{
    console.log(data)
    data=JSON.parse(data)
    const from=data.from
    const to=data.to
    const key=`${from}_${to}`
    client_socket.emit('news', key)

    if(data.un=='1' && cryptoSocketList[key]!=undefined && cryptoSocketList[key]!=null){
      console.log('unsubscibe from cryptocompare socket')
      cryptoSocketList[key].unsubscribe()
      cryptoSocketList[key]=undefined
    }else if(data.un==undefined && cryptoSocketList[key]==undefined){
      console.log(data.from+','+data.to)
      cryptoSocketList[key]=new CryptoSocket(from,to,client_socket)
      cryptoSocketList[key].subscribe()
    }
    
  });
});






module.exports = app;
