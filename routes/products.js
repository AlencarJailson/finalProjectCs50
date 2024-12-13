const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('lider_cestas.db');
const flash = require('connect-flash');

router.get('/', (req, res, next) => {
    db.all('SELECT * FROM products', (err, products) => {
        if (err) {
            return next(err);
        }
        res.render('products', { title: 'Products', products: products });
    });
});

router.post('/', (req, res) => {
    const { description } = req.body;
    if (!description) {
        req.flash('errDescript', 'Digite o Produto');
        return res.status(403).redirect('/products');
    }
    db.run (`
        INSERT INTO products (description) VALUES (?)`,
            [description]
    );
    req.flash('sucess', 'Produto Cadastrado!');
    res.redirect('/products');
});

router.post('/delete', (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(403).redirect('/products');
    }
    db.run (`
        DELETE FROM products WHERE id = ?`,
            [id], function(err) {
                if (err) {
                    req.flash('errDelete', 'Erro na Exclusão');
                    return res.status(500).redirect('/products');
                }
            }
    );
    res.redirect('/products');
});

module.exports = router;