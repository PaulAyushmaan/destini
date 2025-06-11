const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'college', 'driver'],
        required: true
    },
    // Role-specific fields
    studentId: {
        type: String,
        required: function() { return this.role === 'student'; }
    },
    institutionName: {
        type: String,
        required: function() { return this.role === 'college'; }
    },
    licenseNumber: {
        type: String,
        required: function() { return this.role === 'driver'; }
    },
    // Payment and services fields for colleges
    isPaid: {
        type: Boolean,
        default: false
    },
    services: {
        type: [String],
        enum: ['cab', 'shuttle', 'rental'],
        default: []
    },
    // Additional fields
    isVerified: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    socketId: {
        type: String,
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};

userSchema.methods.comparePassword = async function (candidatePassword) {
    console.log('Comparing passwords:', { candidatePassword, storedPassword: this.password });
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;