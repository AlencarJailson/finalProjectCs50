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
const { initBd } = require('./db');

const app = express();
const port = 3333;

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

initBd();

const db = new sqlite3.Database('./lider_cestas.db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
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

function loginRequired(req, res, next) {
    if (!req.session.user_id) {
        req.flash('error', 'Voce deve estar logado');
    }
    next();
}

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username | !password)  {
        return res.status(403).send('usuario ou senha invalido');
    }
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).send('erro na base de dados');
        }
        if (!row | !bcrypt.compareSync(password, row.hash)) {
            return res.status(403).send('usuario ou senha invalido');
        }
        req.session.user_id = row.id;
        res.redirect('/');
    });
});

app.get('/login', (req, res) => {
    res.send(loginRouter);
});

app.get('/', loginRequired, (req, res) => {

    res.send(indexRouter);
})

app.listen(port, () => {
    console.log(`Ex app ${port}`)
})

module.exports = app;
