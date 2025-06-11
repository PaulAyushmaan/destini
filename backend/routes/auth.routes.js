const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { authUser } = require('../middlewares/auth.middleware');

// Get current user
router.get('/me', authUser, async (req, res) => {
    try {
        // req.user is already set by authUser middleware
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            studentId: user.studentId,
            institutionName: user.institutionName,
            licenseNumber: user.licenseNumber,
            phone: user.phone,
            isPaid: user.isPaid,
            services: user.services
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Error fetching user data' });
    }
});

// Register route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, role, studentId, institutionName, licenseNumber } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with role-specific fields
        const userData = {
            name,
            email,
            password: hashedPassword,
            phone,
            role
        };

        // Add role-specific fields
        if (role === 'student') {
            userData.studentId = studentId;
        } else if (role === 'college') {
            userData.institutionName = institutionName;
        } else if (role === 'driver') {
            userData.licenseNumber = licenseNumber;
        }

        const user = new User(userData);
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isPaid: user.isPaid,
                services: user.services
            }
        });
        console.log("Registration response sent with token:", { userId: user._id, token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message || 'Error registering user' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        if (!email || !password) {
            console.log('Missing credentials:', { email: !!email, password: !!password });
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('User found:', { id: user._id, role: user.role });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        const responseData = {
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                studentId: user.studentId,
                institutionName: user.institutionName,
                licenseNumber: user.licenseNumber,
                phone: user.phone,
                isPaid: user.isPaid,
                services: user.services
            }
        };

        console.log("responseData",responseData)
        console.log("user",user)
        console.log('Sending successful login response for user:', user._id);
        res.json(responseData);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

module.exports = router; 