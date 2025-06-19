import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';
const SOCKET_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';

const DriverContext = createContext();

export const useDriver = () => {
  const context = useContext(DriverContext);
  if (!context) {
    throw new Error('useDriver must be used within a DriverProvider');
  }
  return context;
};

export const DriverProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [driverData, setDriverData] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Add this at the top of your DriverProvider component
const [initialized, setInitialized] = useState(false);

// Modify your initialization useEffect
useEffect(() => {
  const initializeDriver = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const storedDriverData = localStorage.getItem('driverData');

      // If no token exists, mark as initialized and return
      if (!token) {
        setInitialized(true);
        setIsLoading(false);
        return;
      }

      // If we have stored data, use it immediately
      if (storedDriverData) {
        const driver = JSON.parse(storedDriverData);
        setDriverData(driver);
        setIsAvailable(driver.status === 'available');
      }

      // Always try to fetch fresh data
      try {
        const freshData = await fetchDriverStatus();
        if (freshData) {
          setDriverData(freshData);
          setIsAvailable(freshData.status === 'available');
          localStorage.setItem('driverData', JSON.stringify(freshData));
        } else if (!storedDriverData) {
          // No data from server and no stored data - clear everything
          localStorage.removeItem('driverData');
          localStorage.removeItem('token');
          setDriverData(null);
        }
      } catch (error) {
        console.error('Error fetching fresh driver data:', error);
        if (!storedDriverData) {
          localStorage.removeItem('driverData');
          localStorage.removeItem('token');
          setDriverData(null);
        }
      }
    } finally {
      setInitialized(true);
      setIsLoading(false);
    }
  };

  initializeDriver();
}, []);

  // Initialize driver data from localStorage and fetch current status
  useEffect(() => {
// In the initialization useEffect:
const initializeDriver = async () => {
  try {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    const storedDriverData = localStorage.getItem('driverData');
    
    // Immediately set stored data if available
    if (storedDriverData) {
      const driver = JSON.parse(storedDriverData);
      setDriverData(driver);
      setIsAvailable(driver.status === 'available');
    }
    
    // Then try to fetch fresh data
    if (token) {
      try {
        const freshData = await fetchDriverStatus();
        if (freshData) {
          setDriverData(freshData);
          setIsAvailable(freshData.status === 'available');
          localStorage.setItem('driverData', JSON.stringify(freshData));
        } else if (!storedDriverData) {
          // No fresh data and no stored data - clear everything
          localStorage.removeItem('driverData');
          localStorage.removeItem('token');
          setDriverData(null);
        }
      } catch (error) {
        console.error('Error fetching fresh driver data:', error);
        // If we have stored data, continue with it
        if (!storedDriverData) {
          localStorage.removeItem('driverData');
          localStorage.removeItem('token');
          setDriverData(null);
        }
      }
    }
  } finally {
    setIsLoading(false);
  }
};

    initializeDriver();
  }, []);

  // Function to fetch current driver status
  const fetchDriverStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return null;
      }

      console.log('Fetching driver status with token:', token);
      const response = await fetch(`${API_BASE}/captains/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch driver status:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error('Failed to fetch driver status');
      }

      const data = await response.json();
      console.log('Fetched driver status:', data);
      
      if (!data.captain) {
        console.error('No captain data in response:', data);
        throw new Error('Invalid response format');
      }

      return data.captain;
    } catch (error) {
      console.error('Error fetching driver status:', error);
      throw error;
    }
  };

  // Function to update socket ID in backend
  const updateSocketId = async (socketId) => {
    try {
      console.log('Attempting to update socket ID:', socketId);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE}/captains/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          socketId,
          status: isAvailable ? 'available' : 'offline'
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update socket ID');
      }

      const data = await response.json();
      console.log('Socket ID update response:', data);
      setDriverData(data.captain);
      setIsAvailable(data.captain.status === 'available');
      localStorage.setItem('driverData', JSON.stringify(data.captain));
      return data;
    } catch (error) {
      console.error('Error updating socket ID:', error);
      throw error;
    }
  };

  // Socket connection and management
  useEffect(() => {
    if (!driverData?._id) return;

    console.log('Initializing socket connection for driver:', driverData._id);
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: {
        token
      },
      query: {
        userId: driverData._id,
        userType: 'captain',
        status: isAvailable ? 'available' : 'offline'
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
      autoConnect: false // Prevent auto-connection
    });

    // Handle socket connection
    newSocket.on('connect', async () => {
      console.log('Socket connected with ID:', newSocket.id);
      try {
        await updateSocketId(newSocket.id);
        // Emit join event after successful socket ID update
        newSocket.emit('join', {
          userId: driverData._id,
          userType: 'captain',
          status: isAvailable ? 'available' : 'offline'
        });
      } catch (error) {
        console.error('Failed to update socket ID on connect:', error);
      }
    });

    // Handle reconnection
    newSocket.on('reconnect', async (attempt) => {
      console.log('Socket reconnected after', attempt, 'attempts');
      try {
        await updateSocketId(newSocket.id);
        await fetchDriverStatus(); // Sync status after reconnection
        newSocket.emit('join', {
          userId: driverData._id,
          userType: 'captain',
          status: isAvailable ? 'available' : 'offline'
        });
      } catch (error) {
        console.error('Failed to update socket ID on reconnect:', error);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Set the socket and connect
    setSocket(newSocket);
    newSocket.connect();

    // Cleanup function
    return () => {
      console.log('Cleaning up socket connection');
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [driverData?._id]); // Only depend on driverData._id to prevent unnecessary reconnections

  const toggleAvailability = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Toggling availability. Current status:', isAvailable);
      const response = await fetch(`${API_BASE}/captains/toggle-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle availability');
      }

      const data = await response.json();
      console.log('Toggle availability response:', data);
      
      // Update local state with the new status
      setDriverData(data.captain);
      setIsAvailable(data.captain.status === 'available');
      localStorage.setItem('driverData', JSON.stringify(data.captain));

      // Update socket with new status
      if (socket?.connected) {
        socket.emit('update-availability', {
          isAvailable: data.captain.status === 'available',
          userId: data.captain._id
        });
      }

      return data;
    } catch (error) {
      console.error('Error toggling availability:', error);
      throw error;
    }
  };

  const updateStatus = async (status) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE}/captains/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status,
          socketId: socket?.id || null
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }

      const data = await response.json();
      setDriverData(data.captain);
      setIsAvailable(data.captain.status === 'available');
      localStorage.setItem('driverData', JSON.stringify(data.captain));

      // Emit status update through socket
      if (socket?.connected) {
        socket.emit('status_update', { status });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  };

  const value = {
    initialized, 
    socket,
    driverData,
    isAvailable,
    isLoading,
    toggleAvailability,
    updateStatus,
    updateSocketId,
    fetchDriverStatus // Export the function for direct use
  };

  return (
    <DriverContext.Provider value={value}>
      {children}
    </DriverContext.Provider>
  );
}; 