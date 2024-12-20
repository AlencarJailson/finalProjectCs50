const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('lider_cestas.db');
const flash = require('connect-flash');

router.get('/', (req, res, next) => {
    db.all('SELECT * FROM baskets b1 JOIN products p1 ON b1.product_id = p1.id', (err, baskets) => {
        if (err) {
            return next(err);
        }
        db.all('SELECT * FROM products', (err, products) => {
            if (err) {
                return next(err);
            }
            const { basket_id } = req.query;
            if (basket_id) {
                db.all('SELECT * FROM config_basket JOIN products ON config_basket.product_id = products.id WHERE config_basket.basket_id = ?', [basket_id], (err, basketProducts) => {
                    if (err) {
                        return next(err);
                    }
                    res.render('configurations', { title: 'Configurations', baskets: baskets, products: products, basketProducts: basketProducts, selectedBasket: basket_id });
                });
            } else {
                res.render('configurations', { title: 'Configurations', baskets: baskets, products: products, basketProducts: [], selectedBasket: null });
            }
        });
    });
});

router.post('/', (req, res) => {
    const { basket_id, amount, product_id } = req.body;
    if (!basket_id || !amount || !product_id) {
        return res.status(403).redirect('/configurations');
    }
    db.run(`
        INSERT INTO config_basket (basket_id, amount, product_id) VALUES (?, ?, ?)`,
        [basket_id, amount, product_id], function(err) {
            if (err) {
                req.flash('error', 'Erro ao inserir produto');
                return res.status(500).redirect(`/configurations?basket_id=${basket_id}`);
            }
            req.flash('success', 'Produto Inserido');
            res.redirect(`/configurations?basket_id=${basket_id}`);
        }
    );
});

router.post('/delete', (req, res) => {
    const { id, basket_id } = req.body;
    if (!id) {
        return res.status(403).redirect(`/configurations?basket_id=${basket_id}`);
    }
    db.run(`
        DELETE FROM config_basket WHERE id = ?`,
        [id], function(err) {
            if (err) {
                req.flash('errDelete', 'Erro na exclusão');
                return res.status(500).redirect(`/configurations?basket_id=${basket_id}`);
            }
            res.redirect(`/configurations?basket_id=${basket_id}`);
        }
    );
});

module.exports = router;