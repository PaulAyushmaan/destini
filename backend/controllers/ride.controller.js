const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId, getIO } = require('../socket');
const rideModel = require('../models/ride.model');
const captainModel = require('../models/captain.model');


module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { pickup, destination, vehicleType } = req.body;
    console.log('Creating ride with data:', req.body);
    try {
        // Create the ride first
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        console.log('Ride created:', ride);
        
        // Get pickup coordinates
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        console.log('Pickup coordinates:', pickupCoordinates);
        
        // Find all active captains
        const captains = await mapService.getCaptainsInTheRadius(pickupCoordinates.lat, pickupCoordinates.lng, 2);
        console.log('Active captains:', captains);
        
        // Populate the ride with user data
        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');
        console.log('Ride with user data:', rideWithUser);
        
        // Send notifications to all active captains
        if (captains && captains.length > 0) {
            console.log(`Notifying ${captains.length} active captains`);
            const io = getIO();
            if (io) {
                // Broadcast to all captains in the 'captains' room
                io.to('captains').emit('new-ride', rideWithUser);
            } else {
                console.error('Socket.io not initialized');
            }
        } else {
            console.log('No active captains found');
        }

        // Send response after all operations are complete
        res.status(201).json(rideWithUser);

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

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        // Notify the user
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });
        
        // Also notify the driver (captain)
        sendMessageToSocketId(ride.captain.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp });

        console.log('Ride started:', ride);

        // Get the IO instance
        const io = getIO();
        if (io && ride.user) {
            // Emit to all users in the users room
            io.to('users').emit('ride-started', {
                rideId,
                status: 'ongoing'
            });

            // Emit specifically to the user who requested the ride
            if (ride.user.socketId) {
                io.to(ride.user.socketId).emit('ride-started', {
                    rideId,
                    status: 'ongoing'
                });
            }
        }

        return res.status(200).json(ride);
    } catch (err) {
        console.error('Error starting ride:', err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const captain = req.captain;
        const ride = await rideService.endRide({ rideId, captain });

        // Get the IO instance
        const io = getIO();
        if (io && ride.user) {
            // Emit to all users in the users room
            io.to('users').emit('ride-completed', {
                rideId,
                status: 'completed'
            });

            // Emit specifically to the user who requested the ride
            if (ride.user.socketId) {
                io.to(ride.user.socketId).emit('ride-completed', {
                    rideId,
                    status: 'completed'
                });
            }
        }

        return res.status(200).json(ride);
    } catch (err) {
        console.error('Error ending ride:', err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.acceptRide = async (req, res) => {
    try {
        const { rideId } = req.params;

        console.log('Accepting ride:', { rideId });

        // Update ride status
        const updatedRide = await rideModel.findByIdAndUpdate(
            rideId,
            { 
                status: 'accepted',
                captain: req.captain._id
            },
            { new: true }
        ).populate('user');

        if (!updatedRide) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Use req.captain instead of looking up by driverId
        const captain = req.captain;

        // Emit socket event
        const io = getIO();
        if (io) {
            // Emit to all users in the 'users' room
            io.to('users').emit('ride-accepted', {
                rideId,
                driverId: req.captain._id,
                driverName: captain.fullname,
                vehicleDetails: captain.vehicle
            });

            // Emit to specific user who requested the ride
            if (updatedRide.user) {
                io.to(updatedRide.user.toString()).emit('ride-accepted', {
                    rideId,
                    driverId: req.captain._id,
                    driverName: captain.fullname,
                    vehicleDetails: captain.vehicle
                });
            }
        }

        return res.status(200).json(updatedRide);
    } catch (error) {
        console.error('Error accepting ride:', error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports.getRideById = async (req, res) => {
    try {
        const { rideId } = req.params;
        const ride = await rideModel.findById(rideId)
            .select('+otp')  // Explicitly select the OTP field
            .populate('user')
            .populate('captain');

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        return res.status(200).json(ride);
    } catch (error) {
        console.error('Error getting ride:', error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports.cancelRide = async (req, res) => {
    try {
        const { rideId } = req.params;

        // Find the ride first to check its status
        const ride = await rideModel.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Prevent cancellation if ride is accepted
        if (ride.status === 'accepted') {
            return res.status(400).json({ message: 'Cannot cancel ride after it has been accepted by a driver' });
        }

        // Find and update the ride
        const updatedRide = await rideModel.findByIdAndUpdate(
            rideId,
            { status: 'cancelled' },
            { new: true }
        ).populate('user').populate('captain');

        // Get the IO instance
        const io = getIO();
        if (io) {
            // Emit to all users in the users room
            io.to('users').emit('ride-cancelled', {
                rideId,
                status: 'cancelled'
            });

            // Emit specifically to the user who requested the ride
            if (updatedRide.user && updatedRide.user.socketId) {
                io.to(updatedRide.user.socketId).emit('ride-cancelled', {
                    rideId,
                    status: 'cancelled'
                });
            }

            // Emit to the driver if there is one
            if (updatedRide.captain && updatedRide.captain.socketId) {
                io.to(updatedRide.captain.socketId).emit('ride-cancelled', {
                    rideId,
                    status: 'cancelled'
                });
            }
        }

        return res.status(200).json(updatedRide);
    } catch (error) {
        console.error('Error cancelling ride:', error);
        return res.status(500).json({ message: error.message });
    }
};