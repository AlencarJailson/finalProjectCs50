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
        db.all('SELECT * FROM baskets JOIN products ON products.id = baskets.product_id', (err, baskets) => {
            if (err) {
                return next(err);
            }
            db.all('SELECT * FROM config_basket JOIN baskets  ON config_basket.basket_id = baskets.id JOIN products ON products.id = baskets.product_id', (err, configurations) => {
                if (err) {
                    return next(err);
                }
                res.render('configurations', { title: 'Configurations', products: products, baskets: baskets, configurations: configurations });
            });
        });
    });
});

router.post('/', (req, res) => {
    const { date, basket_id, amount, product_id } = req.body;
    if (!date, !basket_id, !amount, !product_id) {
        return res.status(403).redirect('/configurations');
    }
    db.run (`
        INSERT INTO config_basket (date, basket_id, amount, product_id) VALUES (?, ?, ?, ?)`,
        [date, basket_id, amount, product_id]
    );
    req.flash('sucess', 'Produto Inserido');
    res.redirect('/configurations');
});

router.post('/delete', (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(403).redirect('/configurations');
    }
    db.run(`
        DELETE FROM config_basket WHERE id = ?`,
            [id], function(err) {
                if (err) {
                    req.flash('errDelete', 'Erro na exclusão');
                    return res.status(500).redirect('/configurations');
                }
            }
    );
    res.redirect('/configurations');
});

module.exports = router;