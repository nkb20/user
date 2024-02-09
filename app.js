var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const { dbconnect } = require("./db_connection/connection")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const JsonResponse = require("./model/response_model")

dbconnect();
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);

app.use('/api/v1/user', usersRouter);



app.get('/reset-page',(req,res,next)=>{
  // const isUserName=req.body.username==="Aftab"
  res.render('reset-password-page')
})

// app.post('/login',(req,res,next)=>{
//   // const isUserName=req.body.username==="Aftab"
//   res.render('login-page')
// })


// app.get('/home-page',(req,res,next)=>{
//   // const isUserName=req.body.username==="Aftab"
//   res.render('index')
// })




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("Aftab");
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  console.log("khan");

  console.log(err.stack)
  res.status(err.statusCode||500).json(JsonResponse.error(err.message));
});

module.exports = app;
