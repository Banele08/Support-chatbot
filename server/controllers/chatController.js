// server/controllers/chatController.js
const asyncHandler = require('express-async-handler'); // For handling async errors
const { getAiResponse } = require('./aiController'); // Import your AI logic

// @desc    Send message to AI and get a response
// @route   POST /api/chat/message
// @access  Private (requires authentication)
const sendMessageToAI = asyncHandler(async (req, res) => {
    const { userMessage } = req.body; // Expecting userMessage from the frontend

    if (!userMessage) {
        res.status(400);
        throw new Error('Please enter a message');
    }

    try {
        // Call the AI model from aiController.js
        const aiResponse = await getAiResponse(userMessage);

        // Send the AI's response back to the frontend
        res.status(200).json({ aiResponse });

    } catch (error) {
        console.error('Error in sendMessageToAI:', error);
        res.status(500).json({ message: 'Error getting AI response.' });
    }
});

module.exports = {
    sendMessageToAI,
};