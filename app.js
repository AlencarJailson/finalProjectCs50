var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register')
const citiesRouter = require('./routes/cities');
const express = require('express');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const { initBd } = require('./db');

initBd();
const app = express();
const port = 3000;

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/cities', citiesRouter);


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

function loginRequired(req, res, next) {
    if (!req.session.user_id) {
        req.flash('error', 'Voce deve estar logado');
    }
    next();
}

app.get('/', loginRequired, (req, res) => {
    res.send(indexRouter);
});

app.get('/login', (req, res) => {
    res.send(loginRouter);
});

app.post('/login', (req, res) => {
    res.send(loginRouter);
});

app.get('/register', (req, res) => {
    res.send(registerRouter);
});

app.get('/cities', (req, res) => {
    res.send(citiesRouter);
});

app.listen(port, () => {
    console.log(`Ex app ${port}`);
});

module.exports = app;
