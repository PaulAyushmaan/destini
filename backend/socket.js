const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const Ride = require('./models/ride.model');

let io = null;

function initializeSocket(server) {
    if (io) {
        return io;
    }

    io = socketIo(server, {
        cors: {
            origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
            methods: ['GET', 'POST'],
            credentials: true
        },
        allowEIO3: true,
        transports: ['websocket', 'polling']
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Handle user joining
        socket.on('join', async (data) => {
            try {
                const { userId, userType } = data;
                console.log('Join event:', { userId, userType, socketId: socket.id });
                
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
                    
                    // Update captain's status to available and active
                    await captainModel.findByIdAndUpdate(
                        userId,
                        { 
                            socketId: socket.id,
                            isActive: true,
                            status: 'available'
                        },
                        { new: true }
                    );
                    console.log(`Captain ${userId} marked as active and available`);
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
            try {
                const { isAvailable, userId } = data;
                console.log('Update availability:', { isAvailable, userId });
                
                if (!userId) {
                    console.error('No user ID provided for availability update');
                    return;
                }

                const status = isAvailable ? 'available' : 'offline';
                const captain = await captainModel.findByIdAndUpdate(
                    userId,
                    { 
                        isActive: isAvailable,
                        status: status,
                        socketId: isAvailable ? socket.id : null
                    },
                    { new: true }
                );

                console.log(`Captain ${userId} availability updated:`, {
                    isActive: captain.isActive,
                    status: captain.status
                });
            } catch (error) {
                console.error('Error updating captain availability:', error);
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

                // Update the ride status and include OTP in response
                const updatedRide = await Ride.findByIdAndUpdate(
                    rideId,
                    { 
                        status: 'accepted',
                        captain: driverId
                    },
                    { new: true }
                ).populate('user').select('+otp');

                if (!updatedRide) {
                    console.error('Ride not found:', rideId);
                    return;
                }

                console.log('Ride accepted successfully:', updatedRide);
                console.log('Ride OTP:', updatedRide.otp);

                const rideData = {
                    ...updatedRide.toObject(),
                    captain: {
                        _id: captain._id,
                        fullname: captain.fullname,
                        vehicle: captain.vehicle
                    }
                };

                // Emit to all users in the users room
                io.to('users').emit('ride-accepted', rideData);

                // Emit specifically to the user who requested the ride
                if (updatedRide.user && updatedRide.user.socketId) {
                    io.to(updatedRide.user.socketId).emit('ride-accepted', rideData);
                }

                // Emit to the accepting driver
                io.to(socket.id).emit('ride-accepted', rideData);

            } catch (error) {
                console.error('Error accepting ride:', error);
            }
        });

        socket.on('disconnect', async () => {
            try {
                console.log(`Client disconnected: ${socket.id}`);
                
                // Find and update captain's status using socket ID
                const captain = await captainModel.findOneAndUpdate(
                    { socketId: socket.id },
                    { 
                        isActive: false,
                        status: 'offline',
                        socketId: null
                    },
                    { new: true }
                );

                if (captain) {
                    console.log(`Captain ${captain._id} marked as offline due to disconnect`);
                }
            } catch (error) {
                console.error('Error updating captain status on disconnect:', error);
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