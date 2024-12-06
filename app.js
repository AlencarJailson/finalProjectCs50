var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const express = require('express');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3333;

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());


//create and/or conect database
const db = new sqlite3.Database('lider_cestas.db', (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log('Sucess');
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTERGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            function TEXT NOT NULL,
            phone INTERGER NOT NULL
        )
    `)
    db.run(`

    `)
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


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

app.get('/', (req, res) => {
    res.send(indexRouter);
})

app.listen(port, () => {
    console.log(`Ex app ${port}`)
})

module.exports = app;
