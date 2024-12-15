const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('lider_cestas.db');
const flash = require('connect-flash');

router.get('/', (req, res, next) => {
    db.all('SELECT * FROM suppliers', (err, suppliers) => {
        if (err) {
            return next(err);
        }
        res.render('suppliers', { title: 'Suppliers', suppliers: suppliers});
    });
});

router.post('/', (req, res) => {
    const { name } = req.body;
    if (!name) {
        req.flash('errName', 'Digite o nome do Fornecedor!');
        return res.status(403).redirect('/suppliers');
    }
    db.run (`
        INSERT INTO suppliers (name) VALUES (?)`,
            [name]
    );
    req.flash('sucess', 'Fornecedor Cadastrado');
    res.redirect('/suppliers');
});

router.post('/delete', (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(403).redirect('/suppliers');
    }
    db.run (`
        DELETE FROM suppliers WHERE id = ?`,
            [id], function(err) {
                if (err) {
                    req.flash('errDelete', 'Erro na exclusão');
                    return res.status(500).redirect('/suppliers');
                }
            }
    );
    res.redirect('/suppliers');
});

module.exports = router;