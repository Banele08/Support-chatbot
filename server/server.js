// server/server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // IMPORT the pool from db.js

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes (important for frontend communication)
app.use(express.json()); // Parse JSON request bodies

// --- REMOVED: Duplicate Database Connection Pool and Test from here ---
// The single pool is now imported from ./config/db.js, and its connection test is within db.js

// Root route for testing server
app.get('/', (req, res) => {
    res.send('HelpDesk Pro Backend API is running!');
});

// Import Routes
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/chat', chatRoutes);

// Global Error Handling Middleware (for Express errors not caught by asyncHandler)
// This should ideally be the last middleware added.
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the stack trace for debugging
    res.status(err.statusCode || 500).json({ // Use custom status code if available, else 500
        message: err.message || 'Something broke!',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack // Don't send stack in production
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));