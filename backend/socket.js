const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const Ride = require('./models/ride.model');
const Captain = require('./models/captain.model');

let io = null;

function initializeSocket(server) {
    if (io) {
        return io;
    }

    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Handle user joining
        socket.on('join', async (data) => {
            try {
                const { userId, userType } = data;
                if (!userId) {
                    console.error('No user ID provided');
                    return;
                }

                // Join appropriate room based on user type
                if (userType === 'user') {
                    socket.join('users');
                    console.log(`User ${userId} joined users room`);
                } else if (userType === 'captain') {
                    socket.join('captains');
                    console.log(`Captain ${userId} joined captains room`);
                }

                // Update user's socket ID in database
                if (userType === 'captain') {
                    await captainModel.findOneAndUpdate(
                        { _id: userId },
                        { 
                            socketId: socket.id,
                            isActive: true,
                            status: 'available'
                        },
                        { upsert: true }
                    );
                    console.log(`Captain ${userId} marked as active`);
                }
            } catch (error) {
                console.error('Error in join handler:', error);
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            try {
                await captainModel.findOneAndUpdate(
                    { _id: userId },
                    {
                        location: {
                            ltd: location.ltd,
                            lng: location.lng
                        }
                    },
                    { upsert: true }
                );
            } catch (error) {
                console.error('Error updating captain location:', error);
            }
        });

        // Handle driver availability updates
        socket.on('update-availability', async (data) => {
            const { isAvailable } = data;
            const userId = socket.handshake.auth.userId || data.userId;
            if (userId) {
                try {
                    await captainModel.findOneAndUpdate(
                        { _id: userId },
                        { 
                            isActive: isAvailable,
                            status: isAvailable ? 'active' : 'inactive'
                        },
                        { upsert: true }
                    );
                    console.log(`Captain ${userId} availability updated to: ${isAvailable}`);
                } catch (error) {
                    console.error('Error updating captain availability:', error);
                }
            }
        });

        // Handle ride acceptance
        socket.on('accept-ride', async (data) => {
            try {
                const { rideId, driverId } = data;
                if (!rideId || !driverId) {
                    console.error('Missing rideId or driverId');
                    return;
                }

                console.log('Ride acceptance request:', data);

                // Find the captain
                const captain = await captainModel.findOne({ _id: driverId });
                if (!captain) {
                    console.error('Captain not found:', driverId);
                    return;
                }
                console.log('Found captain:', captain);

                // Update the ride status
                const updatedRide = await Ride.findByIdAndUpdate(
                    rideId,
                    { 
                        status: 'accepted',
                        captain: driverId
                    },
                    { new: true }
                ).populate('user');

                if (!updatedRide) {
                    console.error('Ride not found:', rideId);
                    return;
                }

                console.log('Ride accepted successfully:', updatedRide);

                // Emit to all users in the users room
                io.to('users').emit('ride-accepted', {
                    ...updatedRide.toObject(),
                    captain: {
                        _id: captain._id,
                        fullname: captain.fullname,
                        vehicle: captain.vehicle
                    }
                });

                // Emit specifically to the user who requested the ride
                if (updatedRide.user && updatedRide.user.socketId) {
                    io.to(updatedRide.user.socketId).emit('ride-accepted', {
                        ...updatedRide.toObject(),
                        captain: {
                            _id: captain._id,
                            fullname: captain.fullname,
                            vehicle: captain.vehicle
                        }
                    });
                }

                // Emit to the accepting driver
                io.to(socket.id).emit('ride-accepted', {
                    ...updatedRide.toObject(),
                    captain: {
                        _id: captain._id,
                        fullname: captain.fullname,
                        vehicle: captain.vehicle
                    }
                });

            } catch (error) {
                console.error('Error accepting ride:', error);
            }
        });

        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            // Update captain's status to inactive on disconnect
            const userId = socket.handshake.auth.userId;
            if (userId) {
                try {
                    await captainModel.findOneAndUpdate(
                        { _id: userId },
                        { 
                            isActive: false,
                            status: 'inactive'
                        },
                        { upsert: true }
                    );
                    console.log(`Captain ${userId} marked as inactive due to disconnect`);
                } catch (error) {
                    console.error('Error updating captain status on disconnect:', error);
                }
            }
        });
    });

    return io;
}

const sendMessageToSocketId = (socketId, messageObject) => {
    if (!io) {
        console.error('Socket.io not initialized');
        return;
    }

    console.log('Sending message:', messageObject);
    io.to(socketId).emit(messageObject.event, messageObject.data);
}

const getIO = () => {
    if (!io) {
        console.error('Socket.io not initialized');
        return null;
    }
    return io;
}

module.exports = { initializeSocket, sendMessageToSocketId, getIO };