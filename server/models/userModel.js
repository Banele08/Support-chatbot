const pool = require('../config/db');

const findUserByEmail = async (email) => {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

const createUser = async (username, email, hashedPassword, role = 'user') => {
    const [result] = await pool.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, role]
    );
    return result.insertId; 
};

const findUserById = async (id) => {
    const [rows] = await pool.execute('SELECT id, username, email, role FROM users WHERE id = ?', [id]);
    return rows[0];
};

module.exports = {
    findUserByEmail,
    createUser,
    findUserById
};