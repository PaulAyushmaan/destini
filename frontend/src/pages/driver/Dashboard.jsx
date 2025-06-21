import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../lib/SocketContext';
import { useDriver } from '../../contexts/DriverContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Car, MapPin, Clock, User, Wallet, Navigation } from 'lucide-react';
import { toast, Toaster } from 'sonner';

const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';

export default function Dashboard() {
  const { socket, newRide, setNewRide } = useContext(SocketContext);
  const { 
    initialized,
    driverData, 
    isAvailable, 
    toggleAvailability, 
    updateStatus, 
    updateSocketId,
    fetchDriverStatus,
    isLoading 
  } = useDriver();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [currentRide, setCurrentRide] = useState(null);
  const [recentRides, setRecentRides] = useState([
    {
      _id: "R1234567",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      status: "completed",
      pickup: "Downtown Mall",
      dropoff: "Airport Terminal 2",
      fare: 850.00
    },
    {
      _id: "R1234568",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      status: "completed",
      pickup: "Central Station",
      dropoff: "Business District",
      fare: 450.00
    },
    {
      _id: "R1234569",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      status: "completed",
      pickup: "Shopping Center",
      dropoff: "Residential Area",
      fare: 550.00
    },
    {
      _id: "R1234570",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      status: "completed",
      pickup: "Hotel Plaza",
      dropoff: "Convention Center",
      fare: 750.00
    }
  ]);
  const [stats, setStats] = useState({
    earnings: 2450.75,
    completedRides: 27,
    rating: 4.8
  });

  // Effect to ensure socket ID is always up to date
  useEffect(() => {
    const syncSocketId = async () => {
      if (socket?.connected && driverData?._id) {
        console.log('Syncing socket ID:', socket.id, 'for driver:', driverData._id);
        try {
          await updateSocketId(socket.id);
        } catch (error) {
          console.error('Failed to sync socket ID:', error);
        }
      }
    };

    syncSocketId();
  }, [socket?.connected, driverData?._id]);

  // Check for driver data and initialize socket on mount
  useEffect(() => {
  console.log('Driver data:', driverData);
  console.log('Is Loading:', isLoading);
  console.log('Initialized:', initialized);

  // Don't do anything until context is fully initialized
  if (!initialized || isLoading) {
    console.log('Context not fully initialized yet');
    return;
  }

  const token = localStorage.getItem('token');
  const storedDriverData = localStorage.getItem('driverData');

  // If no token exists, redirect to login
  if (!token) {
    console.log('No token found, redirecting to login');
    navigate('/login');
    return;
  }

  // If we have a token but no driver data in context, check localStorage
  if (token && !driverData) {
    if (storedDriverData) {
      // If localStorage has data but context doesn't, update context
      console.log('Found driver data in localStorage, updating context');
      const driver = JSON.parse(storedDriverData);
      setDriverData(driver);
      setIsAvailable(driver.status === 'available');
    } else {
      // No data anywhere, redirect to login
      console.log('Token exists but no driver data found, redirecting to login');
      navigate('/login');
      return;
    }
  }
    // console.log('Driver data:', driverData);
    // console.log('Is Loading:', isLoading);
    
    // // Don't make any decisions while the context is still loading
    // if (isLoading) {
    //   console.log('Still loading driver data...');
    //   return;
    // }
    
    // // Only redirect if we're not loading and have no driver data
    // if (!driverData) {
    //   console.log('No driver data found after loading, redirecting to login');
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('driverData');
    //   navigate('/login');
    //   return;
    // }

    console.log('Driver data loaded:', driverData._id, 'Status:', driverData.status);
    console.log('Socket status:', socket?.connected ? 'Connected' : 'Not connected');
    console.log('Is Available:', isAvailable);
    
    // If socket is not connected, try to reconnect
    if (!socket?.connected && socket) {
      console.log('Attempting to reconnect socket...');
      socket.connect();
    }
    
    setLoading(false);
  }, [driverData, isLoading, socket?.connected, isAvailable,navigate,initialized]);

  // Function to fetch available rides
  const fetchAvailableRides = async () => {
    if (!isAvailable) {
      console.log('Skipping ride fetch - driver not available');
      return;
    }

    try {
      console.log('Fetching available rides...');
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE}/rides/available`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Fetch error details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`Failed to fetch rides: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched available rides:', data);
      if (Array.isArray(data)) {
        setRides(data);
      } else {
        console.error('Unexpected response format:', data);
        setRides([]);
      }
    } catch (err) {
      console.error('Error fetching rides:', err);
      setError(err.message);
      setRides([]);
    }
  };

  // Effect to handle new rides from socket context
  useEffect(() => {
    if (newRide && isAvailable && !currentRide) {
      console.log('New ride received from socket context:', newRide);
      setCurrentRide(newRide);
      toast.info('New ride request available!');
      // Refresh available rides list when new ride comes in
      fetchAvailableRides();
    }
  }, [newRide, isAvailable, currentRide]);

  const handleToggleAvailability = async () => {
    try {
      console.log('Toggling availability. Current status:', isAvailable);
      
      // Update availability
      const result = await toggleAvailability();
      console.log('Toggle result:', result);
      
      // If we successfully toggled to available, fetch rides
      if (result.captain.status === 'available') {
        console.log('Status changed to available, fetching rides...');
        await fetchAvailableRides();
      }

      // Show success message
      toast.success(`Status changed to ${result.captain.status}`);
    } catch (error) {
      console.error('Error in handleToggleAvailability:', error);
      toast.error('Failed to update availability: ' + error.message);
    }
  };

  // Function to handle accepting a ride
  const handleAcceptRide = async () => {
    if (!currentRide || !socket || !driverData) return;

    try {
      console.log('Accepting ride:', currentRide._id);
      socket.emit('accept-ride', {
        rideId: currentRide._id,
        driverId: driverData._id
      });
      
      // Update status to busy
      await updateStatus('busy');
      
      navigate(`/driver/ride/${currentRide._id}`, { state: { ride: currentRide } });
    } catch (error) {
      console.error('Error accepting ride:', error);
      toast.error('Failed to accept ride');
    }
  };

  // Function to handle declining a ride
  const handleDeclineRide = async () => {
    if (!currentRide || !socket || !driverData) return;
    
    socket.emit('decline-ride', {
      rideId: currentRide._id,
      driverId: driverData._id
    });
    setCurrentRide(null);
  };

  // Render the rides list
  const renderRides = () => {
    if (rides.length === 0) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No available rides at the moment</p>
        </div>
      );
    }

    return rides.map(ride => (
      <div key={ride._id} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            <div>
              <h3 className="font-semibold text-lg">Available Ride</h3>
              <p className="text-sm text-gray-500">
                {new Date(ride.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Pickup</p>
                <p className="text-sm text-gray-600">{ride.pickup}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Navigation className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Destination</p>
                <p className="text-sm text-gray-600">{ride.destination}</p>
              </div>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div>
              <p className="font-semibold text-lg">₹{ride.fare}</p>
              <p className="text-sm text-gray-500">{ride.vehicleType}</p>
            </div>
            <Button 
              className="w-full"
              onClick={() => {
                setCurrentRide(ride);
                toast.info('Ride selected for review');
              }}
            >
              Review Ride
            </Button>
          </div>
        </div>
      </div>
    ));
  };

  // Set up polling for available rides with more robust error handling
  useEffect(() => {
    let pollInterval;
    let isPolling = false;

    const startPolling = async () => {
      if (isPolling) return;
      isPolling = true;
      
      console.log('Starting ride polling...', {
        isAvailable,
        socketConnected: socket?.connected,
        hasCurrentRide: !!currentRide
      });

      // Initial fetch
      await fetchAvailableRides();

      // Set up interval for subsequent fetches
      pollInterval = setInterval(async () => {
        if (isAvailable && !currentRide) {
          console.log('Polling cycle - fetching rides...');
          await fetchAvailableRides();
        }
      }, 10000); // Poll every 10 seconds
    };

    const stopPolling = () => {
      if (pollInterval) {
        console.log('Stopping ride polling');
        clearInterval(pollInterval);
        isPolling = false;
      }
    };

    if (isAvailable && !currentRide) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isAvailable, currentRide]);

  // Listen for socket events with enhanced error handling
  useEffect(() => {
    if (!socket) {
      console.error('Socket not available for event listening');
      return;
    }

    console.log('Setting up socket event listeners');

    const handleNewRide = (ride) => {
      console.log('New ride received:', ride);
      if (!currentRide) {
        setCurrentRide(ride);
        toast.info('New ride request available!');
        fetchAvailableRides(); // Refresh available rides
      }
    };

    const handleStatusUpdate = (data) => {
      console.log('Status update received:', data);
      fetchDriverStatus(); // Sync with server status
    };

    socket.on('new-ride', handleNewRide);
    socket.on('status_update', handleStatusUpdate);
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      console.log('Cleaning up socket event listeners');
      socket.off('new-ride', handleNewRide);
      socket.off('status_update', handleStatusUpdate);
      socket.off('error');
    };
  }, [socket, driverData?._id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-right" expand={true} richColors />
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        {/* Header Actions */}
        {/* Driver Status */}
        <div className="bg-card text-card-foreground rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Driver Status</h2>
              <p className="text-muted-foreground">
                {isAvailable ? 'You are available for rides' : 'You are currently offline'}
              </p>
            </div>
            <Switch
              checked={isAvailable}
              onCheckedChange={handleToggleAvailability}
            />
          </div>
        </div>

        {/* Current Ride Request */}
        {isAvailable && currentRide && (
          <div className="bg-card text-card-foreground rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">New Ride Request</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Pickup Location</p>
                  <p className="text-muted-foreground">{currentRide.pickup}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Navigation className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Destination</p>
                  <p className="text-muted-foreground">{currentRide.destination}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Fare</p>
                  <p className="text-muted-foreground">₹{currentRide.fare}</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={handleDeclineRide}
                  className="flex-1"
                >
                  Decline
                </Button>
                <Button
                  onClick={handleAcceptRide}
                  className="flex-1"
                >
                  Accept Ride
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Available Rides */}
        {isAvailable && !currentRide && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Available Rides</h2>
            {renderRides()}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card text-card-foreground rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <Wallet className="h-8 w-8 text-primary" />
              <div>
                <p className="text-muted-foreground">Today's Earnings</p>
                <p className="text-2xl font-semibold">₹{stats.earnings}</p>
              </div>
            </div>
          </div>
          <div className="bg-card text-card-foreground rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <Car className="h-8 w-8 text-primary" />
              <div>
                <p className="text-muted-foreground">Completed Rides</p>
                <p className="text-2xl font-semibold">{stats.completedRides}</p>
              </div>
            </div>
          </div>
          <div className="bg-card text-card-foreground rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-primary" />
              <div>
                <p className="text-muted-foreground">Rating</p>
                <p className="text-2xl font-semibold">{stats.rating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Rides */}
        <div className="bg-card text-card-foreground rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Rides</h2>
          <div className="space-y-4">
            {recentRides.length > 0 ? (
              recentRides.map((ride) => (
                <div
                  key={ride._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Ride #{ride._id}</p>
                      <span className={`px-3 py-1 rounded-full ${
                        ride.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                          : ride.status === 'in-progress'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100'
                          : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100'
                      } text-sm`}>
                        {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-1">
                        <span className="font-medium">From:</span> {ride.pickup}
                      </p>
                      <p className="mb-2">
                        <span className="font-medium">To:</span> {ride.dropoff}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-muted-foreground">
                          {new Date(ride.createdAt).toLocaleDateString()} at{' '}
                          {new Date(ride.createdAt).toLocaleTimeString()}
                        </p>
                        <p className="font-medium text-green-600 dark:text-green-400">
                          ₹{ride.fare.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center">No recent rides</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}