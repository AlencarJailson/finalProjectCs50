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
        db.all('SELECT * FROM baskets JOIN products ON products.id = baskets.product_id' , (err, baskets) => {
            if (err) {
                return next(err);
            }
            res.render('baskets', { title: 'Baskets', baskets: baskets, products: products });
        });
    });
});

router.post('/', (req, res) => {
    const { product_id } = req.body;
    if (!product_id) {
        return res.status(403).redirect('/baskets');
    }
    db.run (`
        INSERT INTO baskets (product_id) VALUES (?)`,
            [product_id]
    );
    req.flash('sucess', 'Cesta Cadastrada');
    res.redirect('/baskets');
});

router.post('/delete', (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(403).redirect('/baskets');
    }
    db.run(`
        DELETE FROM baskets WHERE id = ?`,
            [id], function(err) {
                if (err) {
                    req.flash('errDelete', 'Erro na exclusão');
                    return res.status(500).redirect('/baskets');
                }
            }
    );
    res.redirect('/baskets');
});

module.exports = router;