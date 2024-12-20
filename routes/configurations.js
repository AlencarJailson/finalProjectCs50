const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('lider_cestas.db');
const flash = require('connect-flash');

router.get('/', (req, res, next) => {
    db.all('SELECT * FROM baskets JOIN products ON products.id = baskets.product_id', (err, baskets) => {
        if (err) {
            return next(err);
        }
        db.all('SELECT * FROM products', (err, products) => {
            if (err) {
                return next(err);
            }
            res.render('configurations', { title: 'Configurations', baskets: baskets, products: products });
            const { basket_id, date } = req.body;
            if (basket_id){
                console.log('logged')
            }
            if (basket_id && date) {
                db.all('SELECT * FROM config_basket c1 JOIN baskets b1 ON c1.basket_id = b1.id JOIN products p1 ON b1.product_id = p1.id WHERE c1.basket_id = ? AND c1.date = ?',
                    [basket_id, date], (err, configurations) => {
                    if (err) {
                        return next(err);
                    }
                    res.render('configurations', { title: 'Configurations', configurations: configurations, selectedBasket: basket_id, selectedDate: date });
                });
            } else {
                res.render('configurations', { title: 'Configurations', baskets: baskets, products: products, configurations: [], selectedBasket: null, selectedDate: null });
            }
        });
    });
});

module.exports = router;