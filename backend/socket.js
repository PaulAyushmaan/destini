const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const rideModel = require('./models/ride.model');

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [
                'http://localhost:5173',
                'http://localhost:5174',
                'http://localhost:3000',
                'http://127.0.0.1:5173',
                'http://127.0.0.1:5174',
                'http://127.0.0.1:3000'
            ],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                console.error('No token provided in socket handshake');
                return next(new Error('No authentication token provided'));
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (!decoded || !decoded.role) {
                    console.error('Invalid token structure:', decoded);
                    return next(new Error('Invalid token structure'));
                }
                socket.user = decoded;
                console.log('Socket authenticated for user:', decoded.role, decoded.id);
                next();
            } catch (jwtError) {
                console.error('JWT verification failed:', jwtError.message);
                return next(new Error('Invalid or expired token'));
            }
        } catch (err) {
            console.error('Socket authentication error:', err);
            return next(new Error('Authentication failed: ' + err.message));
        }
    });

    io.on('connection', async (socket) => {
        console.log('User connected:', socket.id, 'Role:', socket.user.role);

        try {
            // Update user/captain socket ID
            if (socket.user.role === 'user') {
                await userModel.findByIdAndUpdate(socket.user.id, { 
                    socketId: socket.id,
                    isOnline: true
                });
            } else if (socket.user.role === 'captain') {
                await captainModel.findByIdAndUpdate(socket.user.id, { 
                    socketId: socket.id,
                    isOnline: true
                });
            }

            // Handle location updates for captains
            socket.on('update-location', async (data) => {
                if (socket.user.role === 'captain') {
                    try {
                        await captainModel.findByIdAndUpdate(socket.user.id, {
                            location: data.location,
                            lastLocationUpdate: new Date()
                        });
                    } catch (err) {
                        console.error('Error updating captain location:', err);
                    }
                }
            });

            // Handle ride status updates
            socket.on('ride-status-update', async (data) => {
                try {
                    const { rideId, status } = data;
                    // Emit to both user and captain
                    const ride = await rideModel.findOne({ _id: rideId })
                        .populate('user', 'socketId')
                        .populate('captain', 'socketId');

                    if (ride) {
                        if (ride.user.socketId) {
                            io.to(ride.user.socketId).emit('ride-status-changed', {
                                rideId,
                                status
                            });
                        }
                        if (ride.captain.socketId) {
                            io.to(ride.captain.socketId).emit('ride-status-changed', {
                                rideId,
                                status
                            });
                        }
                    }
                } catch (err) {
                    console.error('Error handling ride status update:', err);
                }
            });

        } catch (err) {
            console.error('Error in socket connection:', err);
        }

        socket.on('disconnect', async () => {
            console.log('User disconnected:', socket.id);
            try {
                if (socket.user.role === 'user') {
                    await userModel.findByIdAndUpdate(socket.user.id, { 
                        socketId: null,
                        isOnline: false
                    });
                } else if (socket.user.role === 'captain') {
                    await captainModel.findByIdAndUpdate(socket.user.id, { 
                        socketId: null,
                        isOnline: false
                    });
                }
            } catch (err) {
                console.error('Error handling disconnect:', err);
            }
        });
    });

    return io;
};

const sendMessageToSocketId = (socketId, message) => {
    if (!socketId) {
        console.log('No socket ID provided for message:', message);
        return;
    }
    try {
        io.to(socketId).emit(message.event, message.data);
    } catch (err) {
        console.error('Error sending socket message:', err);
    }
};

module.exports = {
    initializeSocket,
    sendMessageToSocketId
};