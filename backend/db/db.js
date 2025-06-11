const mongoose = require('mongoose');

// Import all models
require('../models/user.model');
require('../models/captain.model');
require('../models/ride.model');
require('../models/blacklistToken.model');

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectToDb;