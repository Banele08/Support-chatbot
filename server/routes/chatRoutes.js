// server/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { sendMessageToAI } = require('../controllers/chatController'); // We'll create this next
const { protect } = require('../middleware/authMiddleware'); // Assuming you have authMiddleware

// Route to handle messages sent to the AI
// This route will be accessible at /api/chat/message
// It uses 'protect' middleware, meaning only authenticated users can send messages
router.post('/message', protect, sendMessageToAI);

module.exports = router;