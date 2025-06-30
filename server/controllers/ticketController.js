const ticketModel = require('../models/ticketModel');
const { getAiResponse } = require('./aiController'); 

//   Create a new ticket
//   POST /api/tickets
//  Private
const createTicket = async (req, res) => {
    const { title, message } = req.body;
    const userId = req.user.id; 

    if (!title || !message) {
        return res.status(400).json({ message: 'Please include a title and message' });
    }

    try {
        const ticketId = await ticketModel.createTicket(userId, title);
        if (!ticketId) {
            return res.status(500).json({ message: 'Failed to create ticket' });
        }

        //user submits messge
        await ticketModel.addMessage(ticketId, 'user', userId, message);

        //ai responds
        const aiReply = await getAiResponse(message);
        await ticketModel.addMessage(ticketId, 'ai', null, aiReply);

        const newTicket = await ticketModel.getTicketById(ticketId); 
        res.status(201).json(newTicket);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating ticket' });
    }
};

// @desc    Get all tickets (for admin)
// @route   GET /api/tickets
// @access  Private (Admin only)
const getAllTickets = async (req, res) => {
    try {
        const tickets = await ticketModel.getAllTickets();
        res.status(200).json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error getting tickets' });
    }
};

// @desc    Get user's tickets
// @route   GET /api/tickets/my
// @access  Private (User only)
const getMyTickets = async (req, res) => {
    try {
        const userId = req.user.id;
        const tickets = await ticketModel.getTicketsByUserId(userId);
        res.status(200).json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error getting user tickets' });
    }
};


// @desc    Get a single ticket by ID (and its messages)
// @route   GET /api/tickets/:id
// @access  Private
const getTicketAndMessages = async (req, res) => {
    const ticketId = req.params.id;
    const user = req.user; 

    try {
        const ticket = await ticketModel.getTicketById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        
        if (ticket.user_id !== user.id && user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this ticket' });
        }

        const messages = await ticketModel.getMessagesByTicketId(ticketId);

        res.status(200).json({ ...ticket, messages });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error getting ticket details' });
    }
};

//   Add a message to a ticket
//   POST /api/tickets/:id/messages
//   access  Private
const addMessageToTicket = async (req, res) => {
    const ticketId = req.params.id;
    const { content } = req.body;
    const user = req.user;

    if (!content) {
        return res.status(400).json({ message: 'Message content is required' });
    }

    try {
        const ticket = await ticketModel.getTicketById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        
        if (ticket.user_id !== user.id && user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to add message to this ticket' });
        }

        let senderType = user.role; 
        let senderId = user.id;

        
        if (content.toLowerCase().includes('support') && senderType === 'user') {
            
            await ticketModel.updateTicketStatus(ticketId, 'pending');
            const aiResponse = await getAiResponse("The user typed 'support'. Please acknowledge that a human agent will be contacted.");
            await ticketModel.addMessage(ticketId, 'ai', null, aiResponse);
        }

        const messageId = await ticketModel.addMessage(ticketId, senderType, senderId, content);

        
        if (senderType === 'user' && !content.toLowerCase().includes('support')) {
            const aiReply = await getAiResponse(content);
            await ticketModel.addMessage(ticketId, 'ai', null, aiReply);
        }

        const updatedMessages = await ticketModel.getMessagesByTicketId(ticketId);
        res.status(201).json(updatedMessages); // Return all messages to update frontend chat

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error adding message' });
    }
};

//   Update ticket status
//  PUT /api/tickets/:id/status
//  Private (Admin only)
const updateTicketStatus = async (req, res) => {
    const ticketId = req.params.id;
    const { status } = req.body; // New status (open, pending, closed)

    if (!status) {
        return res.status(400).json({ message: 'New status is required' });
    }

    try {
        const ticket = await ticketModel.getTicketById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        
        if (req.user.role !== 'admin') {
             return res.status(403).json({ message: 'Not authorized to change ticket status' });
        }

        const success = await ticketModel.updateTicketStatus(ticketId, status);
        if (success) {
            res.status(200).json({ message: `Ticket status updated to ${status}` });
        } else {
            res.status(400).json({ message: 'Failed to update ticket status' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating ticket status' });
    }
};

module.exports = {
    createTicket,
    getAllTickets,
    getTicketAndMessages,
    addMessageToTicket,
    updateTicketStatus,
    getMyTickets
};