const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain'
    },
    pickup: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },
    fare: {
        type: Number,
        required: true
    },
    vehicleType: {
        type: String,
        enum: ['car', 'moto', 'auto'],
        required: true
    },
    otp: {
        type: String,
        required: true,
        select: false
    },
    duration: {
        type: Number,
    }, // in seconds
    distance: {
        type: Number,
    }, // in meters
    paymentID: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },
    // Scheduled ride fields
    isScheduled: {
        type: Boolean,
        default: false
    },
    schedulePeriod: {
        type: String,
        enum: ['one-time', '15-days', '1-month', '3-months', '6-months', '1-year'],
    },
    scheduleStartDate: {
        type: Date,
    },
    scheduleEndDate: {
        type: Date,
    },
    scheduleDays: [{
        type: String, // e.g., ['Monday', 'Wednesday'] for recurring weekly
    }]
}, {
    timestamps: true
});

// Create and export the model
const Ride = mongoose.model('Ride', rideSchema);
module.exports = Ride;