const pool = require('../config/db');

const createTicket = async (userId, title) => {
    const [result] = await pool.execute(
        'INSERT INTO tickets (user_id, title) VALUES (?, ?)',
        [userId, title]
    );
    return result.insertId;
};

const getAllTickets = async () => {
    const [rows] = await pool.execute(
        `SELECT t.id, t.user_id, t.title, t.status, t.created_at, u.email as user_email
         FROM tickets t
         JOIN users u ON t.user_id = u.id
         ORDER BY t.created_at DESC`
    );
    return rows;
};

const getTicketById = async (ticketId) => {
    const [rows] = await pool.execute(
        `SELECT t.id, t.user_id, t.title, t.status, t.created_at, u.email as user_email
         FROM tickets t
         JOIN users u ON t.user_id = u.id
         WHERE t.id = ?`,
        [ticketId]
    );
    return rows[0];
};

const getMessagesByTicketId = async (ticketId) => {
    const [rows] = await pool.execute(
        'SELECT * FROM messages WHERE ticket_id = ? ORDER BY created_at ASC',
        [ticketId]
    );
    return rows;
};

const addMessage = async (ticketId, senderType, senderId, content) => {
    const [result] = await pool.execute(
        'INSERT INTO messages (ticket_id, sender_type, sender_id, content) VALUES (?, ?, ?, ?)',
        [ticketId, senderType, senderId, content]
    );
    return result.insertId;
};

const updateTicketStatus = async (ticketId, status) => {
    const [result] = await pool.execute(
        'UPDATE tickets SET status = ? WHERE id = ?',
        [status, ticketId]
    );
    return result.affectedRows > 0;
};

const getTicketsByUserId = async (userId) => {
    const [rows] = await pool.execute(
        `SELECT id, title, status, created_at
         FROM tickets
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
    );
    return rows;
};

module.exports = {
    createTicket,
    getAllTickets,
    getTicketById,
    getMessagesByTicketId,
    addMessage,
    updateTicketStatus,
    getTicketsByUserId
};