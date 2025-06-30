const asyncHandler = require('express-async-handler'); // Import this
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel'); // Make sure this path is correct relative to userController.js


// Generate JWT
const generateToken = (id, role) => {
    // Use '1d' (1 day) as a default if process.env.JWT_EXPIRES_IN is not set
    const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: expiresIn,
    });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => { // Wrapped with asyncHandler
    const { username, email, password } = req.body; // Remove isAdmin from destructuring here for public reg

    // Validation
    if (!username || !email || !password) {
        res.status(400); // Bad Request
        throw new Error('Please include all fields');
    }

    // Check if user already exists
    const userExists = await userModel.findUserByEmail(email);
    if (userExists) {
        res.status(400); // Bad Request
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default role to 'user' for public registration
    const role = 'user';

    // Create user in the database
    const userId = await userModel.createUser(username, email, hashedPassword, role);

    // Fetch the newly created user (optional, but good for consistent response)
    const newUser = await userModel.findUserById(userId);

    if (newUser) {
        res.status(201).json({ // 201 Created
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            token: generateToken(newUser.id, newUser.role),
        });
    } else {
        res.status(400); // Bad Request
        throw new Error('Invalid user data');
    }
});

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => { // Wrapped with asyncHandler
    const { email, password } = req.body;

    // Check for user email in the database
    const user = await userModel.findUserByEmail(email);

    // Check if user exists and password matches
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({ // 200 OK
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role),
        });
    } else {
        res.status(401); // 401 Unauthorized (more appropriate for authentication failure)
        throw new Error('Invalid credentials');
    }
});

// @desc    Get current user data (for /api/users/me route)
// @route   GET /api/users/me
// @access  Private (protected by authMiddleware)
const getMe = asyncHandler(async (req, res) => { // Wrapped with asyncHandler
    // The user object is attached to req.user by the protect middleware
    // Destructure specifically what you want to send back
    const { id, username, email, role } = req.user;
    res.status(200).json({
        id,
        username,
        email,
        role,
    });
});


module.exports = {
    registerUser,
    loginUser,
    getMe,
};