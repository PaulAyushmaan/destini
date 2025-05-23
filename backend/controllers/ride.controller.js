const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');
const captainModel = require('../models/captain.model');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { pickup, destination, vehicleType } = req.body;
        const ride = await rideService.createRide({ 
            user: req.user._id, 
            pickup, 
            destination, 
            vehicleType 
        });

        // Get pickup coordinates for finding nearby captains
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        const captainsInRadius = await mapService.getCaptainsInTheRadius(
            pickupCoordinates.lat, 
            pickupCoordinates.lng, 
            2
        );

        // Filter only online captains
        const onlineCaptains = captainsInRadius.filter(captain => captain.isOnline);

        // Populate ride with user details
        const rideWithUser = await rideModel.findOne({ _id: ride._id })
            .populate('user', 'name email phone socketId');

        // Notify all nearby online captains
        onlineCaptains.forEach(captain => {
            if (captain.socketId) {
                sendMessageToSocketId(captain.socketId, {
                    event: 'new-ride',
                    data: {
                        ...rideWithUser.toObject(),
                        distance: captain.distance // Add distance to pickup
                    }
                });
            }
        });

        res.status(201).json(ride);
    } catch (err) {
        console.error('Error creating ride:', err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json({ fare });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rideId } = req.body;
        
        // Check if captain is still online
        const captain = await captainModel.findById(req.captain._id);
        if (!captain.isOnline) {
            return res.status(400).json({ message: 'Captain is currently offline' });
        }

        const ride = await rideService.confirmRide({ 
            rideId, 
            captain: req.captain 
        });

        // Populate ride with necessary details
        const populatedRide = await rideModel.findOne({ _id: ride._id })
            .populate('user', 'name email phone socketId')
            .populate('captain', 'name phone vehicleDetails socketId');

        // Notify user about ride confirmation
        if (populatedRide.user.socketId) {
            sendMessageToSocketId(populatedRide.user.socketId, {
                event: 'ride-confirmed',
                data: populatedRide
            });
        }

        // Notify the confirming captain
        if (populatedRide.captain.socketId) {
            sendMessageToSocketId(populatedRide.captain.socketId, {
                event: 'ride-confirmation-success',
                data: populatedRide
            });
        }

        // Notify other nearby captains that ride is taken
        const pickupCoordinates = await mapService.getAddressCoordinate(populatedRide.pickup);
        const captainsInRadius = await mapService.getCaptainsInTheRadius(
            pickupCoordinates.lat, 
            pickupCoordinates.lng, 
            2
        );

        captainsInRadius.forEach(captain => {
            if (captain.socketId && captain._id.toString() !== req.captain._id.toString()) {
                sendMessageToSocketId(captain.socketId, {
                    event: 'ride-taken',
                    data: { 
                        rideId: populatedRide._id,
                        message: 'This ride has been taken by another captain'
                    }
                });
            }
        });

        return res.status(200).json(populatedRide);
    } catch (err) {
        console.error('Error confirming ride:', err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rideId, otp } = req.query;
        const ride = await rideService.startRide({ 
            rideId, 
            otp, 
            captain: req.captain 
        });

        const populatedRide = await rideModel.findOne({ _id: ride._id })
            .populate('user', 'name email phone socketId')
            .populate('captain', 'name phone vehicleDetails socketId');

        if (populatedRide.user.socketId) {
            sendMessageToSocketId(populatedRide.user.socketId, {
                event: 'ride-started',
                data: populatedRide
            });
        }

        return res.status(200).json(populatedRide);
    } catch (err) {
        console.error('Error starting ride:', err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rideId } = req.body;
        const ride = await rideService.endRide({ 
            rideId, 
            captain: req.captain 
        });

        const populatedRide = await rideModel.findOne({ _id: ride._id })
            .populate('user', 'name email phone socketId')
            .populate('captain', 'name phone vehicleDetails socketId');

        if (populatedRide.user.socketId) {
            sendMessageToSocketId(populatedRide.user.socketId, {
                event: 'ride-ended',
                data: populatedRide
            });
        }

        return res.status(200).json(populatedRide);
    } catch (err) {
        console.error('Error ending ride:', err);
        return res.status(500).json({ message: err.message });
    }
};