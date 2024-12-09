const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./lider_cestas.db');

router.get('/login', (req, res, next) => {
    res.redirect('login');
});

router.post('/login', (req, res) => {
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


module.exports = router;