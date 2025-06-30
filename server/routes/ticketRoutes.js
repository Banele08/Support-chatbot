//user routes
//admin routes

const express = require('express');
const router = express.Router();
const {
    createTicket,
    getAllTickets,
    getTicketAndMessages,
    addMessageToTicket,
    updateTicketStatus,
    getMyTickets
} = require('../controllers/ticketController');
const { protect, authorizeAdmin } = require('../middleware/authMiddleware');


router.post('/', protect, createTicket); 
router.get('/my', protect, getMyTickets); 
router.get('/:id', protect, getTicketAndMessages); 
router.post('/:id/messages', protect, addMessageToTicket); 

// Admin routes 
router.get('/', protect, authorizeAdmin, getAllTickets); 
router.put('/:id/status', protect, authorizeAdmin, updateTicketStatus); 

module.exports = router;