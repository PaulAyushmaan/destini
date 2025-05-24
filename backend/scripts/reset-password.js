const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

async function resetPassword() {
    try {
        await mongoose.connect('mongodb://localhost:27017/destini');
        console.log('Connected to MongoDB');

        const email = 'mukherjeeabhirup737@gmail.com';
        const newPassword = 'Tecb@69';

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        const result = await User.updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );

        if (result.modifiedCount > 0) {
            console.log('Password updated successfully');
        } else {
            console.log('User not found or password not changed');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

resetPassword(); 