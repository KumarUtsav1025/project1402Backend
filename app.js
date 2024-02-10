var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const cors = require('cors');

const db = require('./mongoDB');

//routes 
const indexRouter = require('./routes/index');
const {usersRouter} = require('./routes/users');
const apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());

//session setup
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: "Utsav"
}))

app.use(flash());

//passpost auth
app.use(passport.initialize());
app.use(passport.session());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Check if the request is for an API route
  if (req.originalUrl.startsWith('/api')) {
    // If it's an API route, send JSON response with error details
    res.json({
      error: {
        message: err.message,
        status: err.status || 500
      }
    });
  } else {
    // If it's a normal route, render the error page
    res.render('error');
  }
});

module.exports = app;
