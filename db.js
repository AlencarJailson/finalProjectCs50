const sqlite3 = require('sqlite3').verbose();

//create and/or conect database
const db = new sqlite3.Database('lider_cestas.db', (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log('Sucess');
});

const createTables= () => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    `);

    const city = db.run(`
            CREATE TABLE IF NOT EXISTS cities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                city TEXT NOT NULL
            )
        `);

    db.run(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            street TEXT,
            number TEXT,
            district TEXT,
            city_id INTEGER NOT NULL,
            cpf TEXT UNIQUE,
            observation TEXT,
            seller_id INTEGER NOT NULL,
            location TEXT,
            FOREIGN KEY(city_id) REFERENCES cities(id),
            FOREIGN KEY(seller_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS suppliers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS brands (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS bundle (
            product_id INTEGER,
            brand_id INTEGER,
            bundle INTEGER,
            FOREIGN KEY(product_id) REFERENCES products(id),
            FOREIGN KEY(brand_id) REFERENCES brands(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS payment_methods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            method TEXT NOT NULL UNIQUE
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS reasons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reason TEXT NOT NULL UNIQUE
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS shopping (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            brand_id INTEGER NOT NULL,
            amount INTEGER NOT NULL,
            date TEXT NOT NULL,
            payment_id INTEGER,
            reason_id INTEGER,
            supplier_id INTEGER NOT NULL,
            FOREIGN KEY(product_id) REFERENCES products(id),
            FOREIGN KEY(brand_id) REFERENCES brands(id),
            FOREIGN KEY(payment_id) REFERENCES payment_methods(id),
            FOREIGN KEY(reason_id) REFERENCES reasons(id),
            FOREIGN KEY(supplier_id) REFERENCES suppliers(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            brand_id TEXT NOT NULL,
            reason_id INTEGER NOT NULL,
            payment_id INTEGER NOT NULL,
            date TEXT DEFAULT CURRENT_DATE,
            return_date TEXT NOT NULL,
            amount INTEGER NOT NULL,
            unit_value FLOAT NOT NULL,
            total_value FLOAT NOT NULL,
            order_number TEXT NOT NULL,
            seller_id INTEGER NOT NULL,
            FOREIGN KEY(customer_id) REFERENCES customers(id),
            FOREIGN KEY(brand_id) REFERENCES brands(id),
            FOREIGN KEY(product_id) REFERENCES products(id),
            FOREIGN KEY(reason_id) REFERENCES reasons(id),
            FOREIGN KEY(payment_id) REFERENCES payment_methods(id),
            FOREIGN KEY(seller_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS levy (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER NOT NULL,
            date TEXT DEFAULT CURRENT_DATE,
            return_date TEXT NOT NULL,
            value FLOAT NOT NULL,
            payment_id INTEGER NOT NULL,
            FOREIGN KEY(customer_id) REFERENCES customers(id),
            FOREIGN KEY(payment_id) REFERENCES payment_methods(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS baskets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            FOREIGN KEY(product_id) REFERENCES products(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS config_basket (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT DEFAULT CURRENT_TIMESTAMP,
            basket_id INTEGER NOT NULL,
            amount INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            FOREIGN KEY(basket_id) REFERENCES baskets(id),
            FOREIGN KEY(product_id) REFERENCES products(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS receivables (
            sale_id INTEGER NOT NULL,
            customer_id INTEGER NOT NULL UNIQUE,
            total_purchase FLOAT NOT NULL,
            levy_id INTEGER NOT NULL,
            total_payments FLOAT NOT NULL,
            FOREIGN KEY(customer_id) REFERENCES customers(id),
            FOREIGN KEY(levy_id) REFERENCES levy(id)
        )
    `);

};

const initBd = () => {
    createTables();
};

module.exports = {
    initBd
};