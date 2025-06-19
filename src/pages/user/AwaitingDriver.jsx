import { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { SocketContext } from '../../lib/SocketContext';
import { Button } from '@/components/ui/button';
import { Car, MapPin, Clock, User, Wallet, Navigation, Phone } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { toast, Toaster } from 'sonner';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';

// Routing component
function Routing({ pickupCoords, dropoffCoords }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!pickupCoords || !dropoffCoords) return;

    // Remove existing route if any
    if (routingControlRef.current) {
      routingControlRef.current.remove();
    }

    // Create new route
    const control = L.Routing.control({
      waypoints: [
        L.latLng(pickupCoords.lat, pickupCoords.lng),
        L.latLng(dropoffCoords.lat, dropoffCoords.lng)
      ],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [
          { color: '#3b82f6', weight: 4, opacity: 0.7 }
        ]
      },
      createMarker: function() { return null; } // Disable default markers
    }).addTo(map);

    routingControlRef.current = control;

    return () => {
      if (routingControlRef.current) {
        routingControlRef.current.remove();
      }
    };
  }, [map, pickupCoords, dropoffCoords]);

  return null;
}

export default function AwaitingDriver() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { socket, confirmedRide, setConfirmedRide } = useContext(SocketContext);
  const [ride, setRide] = useState(location.state?.ride || null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(!location.state?.ride);
  const [error, setError] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(location.state?.pickupCoords || null);
  const [dropoffCoords, setDropoffCoords] = useState(location.state?.dropoffCoords || null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  // Fetch ride details
  const fetchRideDetails = async () => {
    try {
      console.log('Fetching ride details for:', rideId);
      const response = await fetch(`${API_BASE}/rides/${rideId}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch ride details');
      }
      const data = await response.json();
      console.log('Fetched ride details:', data);
      console.log('Ride OTP:', data.otp); // Debug log
      setRide(data);
      
      // If ride has a driver, set driver details
      if (data.captain) {
        setDriver(data.captain);
        console.log('Driver details:', data.captain);
      }

      // Fetch coordinates if not in state
      if (!pickupCoords || !dropoffCoords) {
        const pickupResponse = await fetch(`${API_BASE}/maps/get-coordinates?address=${encodeURIComponent(data.pickup)}`, {
          credentials: 'include'
        });
        const dropoffResponse = await fetch(`${API_BASE}/maps/get-coordinates?address=${encodeURIComponent(data.destination)}`, {
          credentials: 'include'
        });
        
        if (pickupResponse.ok && dropoffResponse.ok) {
          const pickupData = await pickupResponse.json();
          const dropoffData = await dropoffResponse.json();
          setPickupCoords(pickupData);
          setDropoffCoords(dropoffData);
        }
      }
    } catch (err) {
      console.error('Error fetching ride details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!socket) {
      console.error('Socket not initialized');
      return;
    }

    if (!rideId) {
      console.error('No ride ID provided');
      setError('Invalid ride ID');
      setLoading(false);
      return;
    }

    // Join user room
    const userId = localStorage.getItem('userId');
    if (userId) {
      socket.emit('join', { userId, userType: 'user' });
    }

    // If we don't have ride data from navigation state, fetch it
    if (!location.state?.ride) {
      fetchRideDetails();
    }

    // Listen for ride acceptance
    socket.on('ride-accepted', (data) => {
      console.log('Ride accepted event received:', data);
      if (data.rideId === rideId || data._id === rideId) {
        console.log('Updating ride with accepted data:', data);
        setRide(data.ride || data);
        
        // // Extract captain details properly
        // const captainData = data.captain || data.ride?.captain;
        // console.log('Captain details11:', captainData);
        // console.log('Driver detailsss:', driver);
        // if (driver) {
        //   setDriver({
        //     name: `${driver.fullname.firstname} ${driver.fullname.lastname || ''}`.trim(),
        //     vehicleDetails: {
        //       model: `${driver.vehicle.color} ${driver.vehicle.vehicleType}`,
        //       number: driver.vehicle.plate
        //     },
        //     eta: '10' // Example ETA, you might want to calculate this dynamically
        //   });
        // }
        
        setConfirmedRide(data);
        
        // Show OTP notification
        const rideOtp = data.otp || data.ride?.otp;
        if (rideOtp) {
          toast.success('Ride Accepted!', {
            description: `Your ride OTP is: ${rideOtp}. Share this with your driver to start the ride.`,
            duration: 10000, // Show for 10 seconds
          });
        }
        
        // Show notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Ride Accepted!', {
            body: `Your ride has been accepted by ${captainData ? captainData.fullname.firstname : 'a driver'}`,
            icon: '/logo.png'
          });
        }
      }
    });

    // Listen for ride status updates
    socket.on('ride-status-update', (data) => {
      console.log('Ride status update received:', data);
      if (data._id === rideId) {
        setRide(prev => ({ ...prev, ...data }));
        // Show notification for status changes
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Ride Update', {
            body: `Your ride status has been updated to ${data.status}`,
            icon: '/logo.png'
          });
        }
        // Navigate to ride completed page if ride is completed
        if (data.status === 'completed') {
          navigate(`/user/ride-completed/${rideId}`);
        }
      }
    });

    // Listen for ride completion
    socket.on('ride-ended', (data) => {
      console.log('Ride ended event received:', data);
      if (data._id === rideId) {
        setRide(prev => ({ ...prev, ...data }));
        // Show notification for ride completion
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Ride Completed', {
            body: 'Your ride has been completed',
            icon: '/logo.png'
          });
        }
        navigate('/user/dashboard');
      }
    });

    // Listen for ride cancellation
    socket.on('ride-cancelled', (data) => {
      console.log('Ride cancelled event received:', data);
      if (data.rideId === rideId) {
        navigate('/user/dashboard');
        // Show notification for cancellation
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Ride Cancelled', {
            body: 'Your ride has been cancelled',
            icon: '/logo.png'
          });
        }
      }
    });

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Set up polling for ride updates
    const pollInterval = setInterval(fetchRideDetails, 5000); // Poll every 5 seconds

    return () => {
      socket.off('ride-accepted');
      socket.off('ride-status-update');
      socket.off('ride-ended');
      socket.off('ride-cancelled');
      clearInterval(pollInterval);
    };
  }, [rideId, socket, navigate, location.state, pickupCoords, dropoffCoords]);

  useEffect(() => {
    console.log('Current ride status:', ride?.status);
    if (ride?.status === 'completed') {
      navigate(`/user/ride-completed/${rideId}`);
    }
  }, [ride?.status, rideId, navigate]);

  const handleCancelClick = () => setShowCancelConfirm(true);

  const handleCancelConfirm = async () => {
    try {
      const response = await fetch(`${API_BASE}/rides/${rideId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (response.ok) {
        if (socket) {
          socket.emit('ride-cancelled', { rideId, status: 'cancelled' });
        }
        setCancelMessage('Ride cancelled successfully');
        setTimeout(() => {
          navigate('/user');
        }, 2000);
      } else {
        const errorData = await response.json();
        setCancelMessage(errorData.message || 'Failed to cancel ride');
      }
    } catch (error) {
      setCancelMessage(error.message);
    }
  };

  const handleCancelClose = () => {
    setShowCancelConfirm(false);
    setCancelMessage('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ride details...</p>
        </div>
      </div>
    );
  }

  if (error) {
  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No ride details found</p>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" expand={true} richColors />
      {/* Cancel Confirmation UI */}
      {showCancelConfirm && !cancelMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100]">
          <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Cancel Ride?</h3>
              <p className="text-sm text-gray-500 mb-4">Are you sure you want to cancel this ride?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCancelClose}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200"
                >
                  Continue Ride
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  Cancel Ride
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Message UI */}
      {cancelMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100]">
          <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ride Cancelled</h3>
              <p className="text-sm text-gray-500 mb-4">{cancelMessage}</p>
              <div className="flex justify-center">
                <Link
                  to="/user"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[500px]">
            {pickupCoords && dropoffCoords ? (
              <MapContainer
                center={[pickupCoords.lat, pickupCoords.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[pickupCoords.lat, pickupCoords.lng]}>
                  <Popup>Pickup Location</Popup>
                </Marker>
                <Marker position={[dropoffCoords.lat, dropoffCoords.lng]}>
                  <Popup>Dropoff Location</Popup>
                </Marker>
                <Routing pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Loading map...</p>
              </div>
            )}
          </div>

          {/* Ride Details Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Ride Details</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">Pickup</p>
                    <p className="text-gray-600">{ride.pickup}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <p className="font-medium">Dropoff</p>
                    <p className="text-gray-600">{ride.destination}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Car className="w-5 h-5 text-green-500" />
                  <p className="text-gray-600">Vehicle Type: {ride.vehicleType}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Wallet className="w-5 h-5 text-purple-500" />
                  <p className="text-gray-600">Fare: ₹{ride.fare}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <p className="text-gray-600">Status: {ride.status}</p>
                </div>
                {ride.status === 'ongoing' && (
                  <Button
                    onClick={() => window.location.href = 'tel:112'}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      SOS - Emergency Call
                    </span>
                  </Button>
                )}
              </div>
            </div>

            {driver ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Driver Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-blue-500" />
                    <p className="text-gray-600">{driver.fullname.firstname.charAt(0).toUpperCase() + driver.fullname.firstname.slice(1)} {driver.fullname.lastname.charAt(0).toUpperCase() + driver.fullname.lastname.slice(1)}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <p className="text-gray-600">{driver.phone}</p>
                  </div>
                  {driver.vehicle && (
                    <div className="flex items-center space-x-3">
                      <Car className="w-5 h-5 text-green-500" />
                      <p className="text-gray-600">
                        {driver.vehicle.color} {driver.vehicle.vehicleType} - Vehicle No: {driver.vehicle.plate}
                      </p>
                    </div>
                  )}
                  {driver && (
                    <div className="flex items-center space-x-3">
                      <Navigation className="w-5 h-5 text-red-500" />
                      <p className="text-gray-600">ETA: 5 minutes</p>
                    </div>
                  )}
                  {ride.otp && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">Your Ride OTP</h3>
                      <p className="text-3xl font-bold text-blue-600 tracking-wider">{ride.otp}</p>
                      <p className="text-sm text-blue-600 mt-2">Share this OTP with your driver to start the ride</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Waiting for Driver</h2>
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <p className="text-gray-600">Searching for nearby drivers...</p>
                </div>
              </div>
            )}

            {/* Show Cancel Ride button only when status is not ongoing, completed, cancelled, or accepted */}
            {ride?.status !== 'ongoing' && ride?.status !== 'completed' && ride?.status !== 'cancelled' && ride?.status !== 'accepted' && (
              <Button
                onClick={handleCancelClick}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                Cancel Ride
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
