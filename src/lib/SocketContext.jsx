import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

// Add better logging for the connection URL
const socketUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';
console.log('Connecting to socket server at:', socketUrl);

const socket = io(socketUrl);

const SocketProvider = ({ children }) => {
    const [newRide, setNewRide] = useState(null);
    const [confirmedRide, setConfirmedRide] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    
    useEffect(() => {
        // Enhanced connection logic
        socket.on('connect', () => {
            console.log('Connected to server with socket ID:', socket.id);
            setIsConnected(true);
            
            // Auto-join room if user is logged in
            const userId = localStorage.getItem('driverId') || localStorage.getItem('userId');
            const userType = localStorage.getItem('userType');
            
            if (userId && userType) {
                console.log(`Auto-joining as ${userType} with ID ${userId}`);
                socket.emit('join', { userId, userType });
            }
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        });
        
        // Listen for new ride events
        socket.on('new-ride', (data) => {
            console.log('New ride received in SocketContext:', data);
            console.log('Current user type:', localStorage.getItem('userType'));
            console.log('Current user ID:', localStorage.getItem('userId') || localStorage.getItem('driverId'));
            setNewRide(data);
        });
        
        // Listen for ride confirmation events
        socket.on('ride-confirmed', (data) => {
            console.log('Ride confirmed event received:', data);
            setConfirmedRide(data);
        });

        // Listen for ride acceptance events
        socket.on('ride-accepted', (data) => {
            console.log('Ride accepted event received:', data);
            setConfirmedRide(data);
        });

        // Cleanup function
        return () => {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('disconnect');
            socket.off('new-ride');
            socket.off('ride-confirmed');
            socket.off('ride-accepted');
        };
    }, []);

    // Function to join a room based on user type and ID
    const joinRoom = (userId, userType) => {
        if (!userId || !userType) {
            console.error('Cannot join room: missing userId or userType');
            return;
        }
        console.log(`Joining room as ${userType} with ID ${userId}`);
        socket.emit('join', { userId, userType });
    };

    return (
        <SocketContext.Provider value={{ 
            socket, 
            newRide, 
            confirmedRide,
            isConnected,
            joinRoom,
            setNewRide,
            setConfirmedRide
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider; 