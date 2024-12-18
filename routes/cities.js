const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('lider_cestas.db');
const flash = require('connect-flash');

router.get('/', (req, res, next) => {
    db.all('SELECT * FROM cities', (err, cities) => {
        if (err) {
            return next(err);
        }
        res.render('cities', { title: 'Cities', cities: cities });
    });
});

router.post('/', (req, res) => {
    const { city } = req.body;
    if (!city) {
        req.flash('error', 'Digite o nome da cidade!');
        return res.status(403).redirect('/cities');
    }
    db.run (`
        INSERT INTO cities (city) VALUES(?)`,
            [city]
    );
    req.flash('sucess', 'Cidade cadastrada!');
    res.redirect('/cities');
});

router.post('/delete', (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(403).redirect('/cities');
    }
    db.run (`
        DELETE FROM cities WHERE id = ?`,
            [id], function(err) {
                if (err) {
                    req.flash('errDelete', 'Erro na Exclusão');
                    return res.status(500).redirect('/cities');
                }
            }
    );
    res.redirect('/cities');
});

module.exports = router;