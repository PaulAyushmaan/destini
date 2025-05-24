const mongoose = require('mongoose');
const captainModel = require('../models/captain.model');

async function fixCaptainIndex() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/destini');
        console.log('Connected to MongoDB');

        // Drop the existing index
        await captainModel.collection.dropIndex('email_1');
        console.log('Dropped existing email index');

        // Create new index with sparse option
        await captainModel.collection.createIndex({ email: 1 }, { 
            unique: true, 
            sparse: true 
        });
        console.log('Created new sparse email index');

        console.log('Index fix completed successfully');
    } catch (error) {
        console.error('Error fixing index:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the fix
fixCaptainIndex(); 