const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, role, studentId, institutionName, licenseNumber } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Validate role-specific fields
        if (role === 'student' && !studentId) {
            return res.status(400).json({ message: 'Student ID is required for student registration' });
        }
        if (role === 'college' && !institutionName) {
            return res.status(400).json({ message: 'Institution name is required for college registration' });
        }
        if (role === 'driver' && !licenseNumber) {
            return res.status(400).json({ message: 'License number is required for driver registration' });
        }

        // Create new user
        const hashedPassword = await userModel.hashPassword(password);
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            ...(role === 'student' && { studentId }),
            ...(role === 'college' && { institutionName }),
            ...(role === 'driver' && { licenseNumber })
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        console.log('Stored password:', user.password);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', isPasswordValid);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Failed to get user details', error: error.message });
    }
};

// Add this function at the end of the file
exports.updateOldUsersPasswords = async (req, res) => {
    try {
        const users = await userModel.find({});
        for (const user of users) {
            if (!user.password.startsWith('$2')) { // Check if password is not hashed
                user.password = await userModel.hashPassword(user.password);
                await user.save();
            }
        }
        res.json({ message: 'All old users updated successfully' });
    } catch (error) {
        console.error('Update old users error:', error);
        res.status(500).json({ message: 'Failed to update old users', error: error.message });
    }
}; 