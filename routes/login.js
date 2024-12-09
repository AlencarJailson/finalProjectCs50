const express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('lider_cestas.db');
const bcrypt = require('bcryptjs');

router.get('/', (req, res, next) => {
    res.render('login', {title: 'Login'});
});

router.post('/', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(403).send('usuario ou senha invalido');
    }
    db.get('SELECT * FROM users WHERE name = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).send('Usuario não cadastrado!');
        }
        if (!row || !bcrypt.compareSync(password, row.password)) {
            return res.status(403).send('usuario ou senha invalido');
        }
        req.session.user_id = row.id;
        res.redirect('/');
    });
});

module.exports = router;