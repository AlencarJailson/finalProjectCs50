const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('lider_cestas.db');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');

router.get('/', (req, res, next) => {
    res.render('register', { title: 'Register'});
});

router.post('/', (req, res) => {
    const { username, password, confirm, phone } = req.body;
    if (!username || !password || !confirm || !phone) {
        req.flash('error', 'Preencha todos os campos!');
        return res.status(403).redirect('/register');
    }
    if (password != confirm) {
        req.flash('error', 'Confirme sua senha!');
        return res.status(403).redirect('/register');
    }
    const hash = bcrypt.hashSync(password, 10);
    db.run(`
        INSERT INTO users (name, password, phone) VALUES(?, ?, ?)`,
            [username, hash, phone]
        );
        req.flash('sucess', 'Registro realizado!');
        res.redirect('/login');
});

module.exports = router;