
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Generate JWT token
const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn: '10s' } // Temporary: Exercise 3 testing
    );
};

// POST /api/users/register (Registration)
const registerUser = async (req, res) => {
    try {
        const { name, email, password, age, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email, and password are required'
            });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(409).json({
                message: 'Email is already registered'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            age,
            role
        });

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id.toString(), user.role)
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: err.message
            });
        }

        if (err.code === 11000) {
            return res.status(409).json({
                message: 'Email is already registered'
            });
        }

        return res.status(500).json({
            message: err.message
        });
    }
};

// POST /api/users/login (Authentication)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id.toString(), user.role)
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

// GET /api/users/profile (Protected profile)
const getUserProfile = async (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

// GET /api/users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        return res.status(200).json(users);

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

// Update authenticated user's password
const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: 'Old password and new password are required'
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Old password is incorrect'
            });
        }

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        return res.status(200).json({
            message: 'Password updated successfully'
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: err.message
            });
        }

        return res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    getAllUsers,
    updatePassword
};
