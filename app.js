var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session')
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var db=require('./config/connection')
var hbs=require('express-handlebars')
var app = express();
var fileUpload = require('express-fileupload')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
db.connect((err)=>{
  if(err)console.log("connection error"+err);
  else console.log("database connected");

})
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials'}))
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use(session({secret:"key",
resave:false,
saveUninitialized:true,
cookie:{maxAge:200000}}))
app.use((req, res, next) => {
  if (!req.user) {
    res.header("cache-control", "private,no-cache,no-store,must revalidate");
    res.header("Express", "-3");
  }
  next();
});
app.use((req, res, next) => {
  if (!req.admin) {
    res.header("cache-control", "private,no-cache,no-store,must revalidate");
    res.header("Express", "-3");
  }
  next();
});
app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
