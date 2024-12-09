const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('lider_cestas.db');
const flash = require('connect-flash');

router.get('/', (req, res, next) => {
    res.render('cities', {title: 'Cities'});
});

router.post('/', (req, res) => {
    const city = req.body;
    if (!city) {
        req.flash('error', 'Digite o nome da cidade!');
        return res.status(403).redirect('/cities');
    }
    db.run (`
        INSERT INTO cities (city) VALUE(?)`,
            [city]
    );
    req.flash('sucess', 'Cidade cadastrada!');
});

module.exports = router;