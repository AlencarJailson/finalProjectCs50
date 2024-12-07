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
        id INTERGER PRIMARY KEY AUTOINCREMENT,
        permission TEXT NOT NULL
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTERGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            permission_id INTERGER NOT NULL,
            phone INTERGER NOT NULL,
            FOREIGN KEY(permission_id) REFERENCES permissions(id)
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS cities (
            id INTERGER PRIMARY KEY AUTOINCREMENT,
            city TEXT NOT NULL
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTERGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            street TEXT,
            number TEXT,
            district TEXT,
            city_id INTERGER NOT NULL,
            cpf TEXT UNIQUE,
            observation TEXT,
            FOREIGN KEY(city_id) REFERENCES cities(id)
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS suppliers (
            id INTERGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTERGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS payment_methods (
            id INTERGER PRIMARY KEY AUTOINCREMENT,
            method TEXT NOT NULL UNIQUE
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS reasons (
            id INTERGER PRIMARY KEY AUTOINCREMENT,
            reason TEXT NOT NULL UNIQUE
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS shopping (
            id INTERGER PRIMARY KEY AUTOINCREMENT,
            product_id INTERGER NOT NULL,
            brand TEXT NOT NULL,
            amount INTERGER NOT NULL,
            date TEXT NOT NULL,
            supplier_id INTERGER NOT NULL,
            FOREGEIN KEY(product_id) REFERENCES products(id)
            FOREGEIN KEY(supplier_id) REFERENCES suppliers(id)
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS sales (
            id INTERGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTERGER NOT NULL,
            product_id INTERGERE NOT NULL,
            brand TEXT NOT NULL,
            reason_id INTERGER NOT NULL,
            payment_id INTERGER NOT NULL,
            date TEXT DEFAULT CURRENT_DATE,
            return_date TEXT NOT NULL,
            amount INTERGER NOT NULL,
            unit_value FLOAT NOT NULL,
            total_value FLOAT NOT NULL,
            seller_id INTERGER NOT NULL,
            FOREIGN KEY(customer_id) REFERENCES customers(id)
            FOREIGN KEY(product_id) REFERENCES products(id)
            FOREIGN KEY(reason_id) REFERENCES reasons(id)
            FOREIGN KEY(payment_id) REFERENCES payment_methods(id)
            FOREIGN KEY(seller_id) REFERENCES users(id)
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS levy (
            id INTERGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTERGER NOT NULL,
            date TEXT DEFAULT CURRENT_DATE,
            return_date TEXT NOT NULL,
            value FLOAT NOT NULL,
            payment_id INTERGER NOT NULL,
            FOREIGN KEY(customer_id) REFERENCES customers(id)
            FOREIGN KEY(payment_id) REFERENCES payment_methods(id)
        )
    `)
    db.run(`
        CREATE TABLE IF NOT EXISTS baskets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTERGER NOT NULL,
            FOREIGN KEY(product_id) REFERENCES products(id)
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS config_basket (
            id INTERGER PRIMARY KEY AUTOINCREMENT,
            date TEXT DEFAULT CURRENT_TIMESTAMP,
            product_id INTERGER NOT NULL,
            amount INTERGER NOT NULL,
            FOREIGN KEY(product_id) REFERENCES products(id)
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS receivables (
            customers_id INTERGER NOT NULL UNIQUE,
            to_receive FLOAT NOT NULL
            FOREIGN KEY(customer_id) REFERENCES customers(id)
        )
    `)

};

const initBd = () => {
    createTables();
};

module.exports = {
    initBd
};