import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../lib/SocketContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Car, MapPin, Clock, User, Wallet, Navigation } from 'lucide-react';

const API_BASE = 'http://localhost:4000';

export default function Dashboard() {
  const { socket } = useContext(SocketContext);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);
  const [recentRides, setRecentRides] = useState([]);
  const [stats, setStats] = useState({
    earnings: 0,
    completedRides: 0,
    rating: 0
  });

  // Fetch rides when component mounts
  useEffect(() => {
    const fetchRides = async () => {
      try {
        console.log('Fetching available rides...');
        const response = await fetch(`${API_BASE}/rides/available`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch rides');
        }
        
        const data = await response.json();
        console.log('Fetched rides:', data);
        setRides(data);
      } catch (err) {
        console.error('Error fetching rides:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();

    // Listen for new ride requests
    socket.on('new-ride-request', (newRide) => {
      console.log('New ride request received:', newRide);
      setRides(prevRides => {
        // Check if ride already exists
        const exists = prevRides.some(ride => ride._id === newRide._id);
        if (!exists) {
          return [newRide, ...prevRides];
        }
        return prevRides;
      });
    });

    // Listen for ride status updates
    socket.on('ride-status-update', (updatedRide) => {
      console.log('Ride status update received:', updatedRide);
      setRides(prevRides => 
        prevRides.map(ride => 
          ride._id === updatedRide._id ? { ...ride, ...updatedRide } : ride
        )
      );
    });

    // Cleanup socket listeners
    return () => {
      socket.off('new-ride-request');
      socket.off('ride-status-update');
    };
  }, [socket]);
  
  useEffect(() => {
    if (!socket) {
      console.error('Socket not initialized');
      return;
    }

    // Join driver room
    const driverId = localStorage.getItem('driverId');
    if (!driverId) {
      console.error('No driver ID found');
      return;
    }

    // Set initial availability status
    const fetchDriverStatus = async () => {
      try {
        // Since there's no direct API endpoint, we'll use the socket connection status
        setIsAvailable(true); // Default to available
      } catch (error) {
        console.error('Error fetching driver status:', error);
      }
    };

    fetchDriverStatus();

    // Join driver room
    socket.emit('join', { userId: driverId, userType: 'captain' });

    // Listen for new ride requests
    socket.on('new-ride', (ride) => {
      console.log('New ride request received:', ride);
      if (isAvailable) {
        setCurrentRide(ride);
      }
    });

    // Handle confirmed rides
    socket.on('ride-accepted', (data) => {
      console.log('Ride confirmation received:', data);
      if (data._id === currentRide?._id) {
        setCurrentRide(null);
        navigate('/driver/ride');
      }
    });

    // Fetch driver stats and recent rides
    const fetchDriverData = async () => {
      try {
        // Since there are no direct API endpoints for stats and rides,
        // we'll initialize with default values
        setStats({
          earnings: 0,
          completedRides: 0,
          rating: 0
        });
        setRecentRides([]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching driver data:', error);
        setLoading(false);
      }
    };

    fetchDriverData();

    return () => {
      socket.off('new-ride');
      socket.off('ride-accepted');
    };
  }, [socket, navigate, isAvailable]);

  const toggleAvailability = async () => {
    const newStatus = !isAvailable;
    const currentDriverId = localStorage.getItem('driverId');
    
    try {
      // Update status through socket
      socket.emit('update-availability', {
        userId: currentDriverId,
        isAvailable: newStatus
      });
      
      setIsAvailable(newStatus);
    } catch (error) {
      console.error('Error updating driver status:', error);
    }
  };

  const handleAcceptRide = async () => {
    if (!currentRide || !socket) return;

    try {
      console.log('Accepting ride:', currentRide._id);
      socket.emit('accept-ride', {
        rideId: currentRide._id,
        driverId: localStorage.getItem('driverId')
      });
      
      setCurrentRide(null);
      navigate(`/driver/ride/${currentRide._id}`, { state: { ride: currentRide } });
    } catch (error) {
      console.error('Error accepting ride:', error);
    }
  };

  const handleDeclineRide = () => {
    if (!currentRide || !socket) return;
    socket.emit('decline-ride', {
      rideId: currentRide._id,
      driverId: localStorage.getItem('driverId')
    });
    setCurrentRide(null);
  };

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Driver Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Driver Status</h2>
              <p className="text-sm text-gray-500">
                {isAvailable ? 'You are available for rides' : 'You are currently offline'}
              </p>
            </div>
            <Switch
              checked={isAvailable}
              onCheckedChange={toggleAvailability}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <Wallet className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Today's Earnings</p>
                <p className="text-2xl font-semibold">₹{stats.earnings}</p>
          </div>
        </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <Car className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Completed Rides</p>
                <p className="text-2xl font-semibold">{stats.completedRides}</p>
              </div>
                  </div>
                </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p className="text-2xl font-semibold">{stats.rating.toFixed(1)}</p>
              </div>
        </div>
      </div>
        </div>

        {/* Current Ride */}
        {currentRide && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">New Ride Request</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Pickup Location</p>
                  <p className="text-gray-600">{currentRide.pickup}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Destination</p>
                  <p className="text-gray-600">{currentRide.destination}</p>
            </div>
              </div>
              <div className="flex items-center space-x-3">
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Fare</p>
                  <p className="text-gray-600">₹{currentRide.fare}</p>
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

        {/* Recent Rides */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Rides</h2>
          <div className="space-y-4">
            {recentRides.length > 0 ? (
              recentRides.map((ride) => (
                <div
                  key={ride._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">Ride #{ride._id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(ride.createdAt).toLocaleDateString()}
                    </p>
                </div>
                  <span className={`px-3 py-1 rounded-full ${
                    ride.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : ride.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  } text-sm`}>
                    {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No recent rides</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}