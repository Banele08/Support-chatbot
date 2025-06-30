// server/config/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


pool.getConnection()
    .then(connection => {
        console.log('Connected to Mysql');
        connection.release();
    })
    .catch(err => {
        console.error('Mysql connection failed:', err.message);
        process.exit(1); 
    });

module.exports = pool;