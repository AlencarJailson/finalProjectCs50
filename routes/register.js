const express = require('express');
const router = express.Router();
const sqlite3 =require('sqlite3').verbose();
const db = new sqlite3.Database('lider_cestas.db');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');

router.get('/', (req, res, next) => {
    res.render('register', { title: 'Register'});
});

router.post('/', async (req, res) => {
    const { username, password, confirm, phone } = req.body;
    if (!username || !password || !confirm || !phone) {
        return res.status(403).send('Preencha todos os campos!');
    }
    if (password != confirm) {
        return res.status(403).send('Confirme sua senha!');
    }
    const hash =  await bcrypt.hashSync(password, 10);
    db.run(`
        INSERT INTO users (name, password, phone) VALUES(?, ?, ?)`,
            [username, hash, phone]
        );
        flash('Registro realizado!');
        res.redirect('/login');
});

module.exports = router;