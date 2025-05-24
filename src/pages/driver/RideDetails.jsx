import { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { SocketContext } from '../../lib/SocketContext';
import { Button } from '@/components/ui/button';
import { Car, MapPin, Clock, User, Wallet, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const API_BASE = 'http://localhost:4000';

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

// Navigation Component
function NavigationComponent({ pickupCoords, dropoffCoords, ride }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!pickupCoords || !dropoffCoords) return;

    // Remove existing route if any
    if (routingControlRef.current) {
      routingControlRef.current.remove();
    }

    // Create new route with turn-by-turn navigation
    const control = L.Routing.control({
      waypoints: [
        L.latLng(pickupCoords.lat, pickupCoords.lng),
        L.latLng(dropoffCoords.lat, dropoffCoords.lng)
      ],
      routeWhileDragging: false,
      show: true, // Show the turn-by-turn instructions
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

    // Center map on pickup location
    map.setView([pickupCoords.lat, pickupCoords.lng], 15);

    return () => {
      if (routingControlRef.current) {
        routingControlRef.current.remove();
      }
    };
  }, [map, pickupCoords, dropoffCoords]);

  return null;
}

export default function RideDetails() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useContext(SocketContext);
  const [ride, setRide] = useState(location.state?.ride || null);
  const [loading, setLoading] = useState(!location.state?.ride);
  const [error, setError] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [showNavigation, setShowNavigation] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  useEffect(() => {
    // Fetch ride details if not available in state
    const fetchRideDetails = async () => {
      if (location.state?.ride) {
        console.log('Using ride from location state:', location.state.ride);
        setRide(location.state.ride);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching ride details for ID:', rideId);
        const response = await fetch(`${API_BASE}/rides/${rideId}`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch ride details');
        }
        const data = await response.json();
        console.log('Fetched ride details:', data);
        console.log('Ride status:', data.status);
        setRide(data);
      } catch (err) {
        console.error('Error fetching ride details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();

    // Listen for ride status updates
    socket.on('ride-status-update', (data) => {
      console.log('Ride status update received:', data);
      if (data._id === rideId) {
        console.log('Updating ride with new data:', data);
        setRide(prev => {
          console.log('Previous ride state:', prev);
          return { ...prev, ...data };
        });
      }
    });

    return () => {
      socket.off('ride-status-update');
    };
  }, [rideId, socket, location.state]);

  // Fetch coordinates for pickup and dropoff locations
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!ride) return;

      try {
        // Fetch pickup coordinates
        const pickupResponse = await fetch(`${API_BASE}/maps/get-coordinates?address=${encodeURIComponent(ride.pickup)}`);
        if (pickupResponse.ok) {
          const pickupData = await pickupResponse.json();
          setPickupCoords(pickupData);
        }

        // Fetch dropoff coordinates
        const dropoffResponse = await fetch(`${API_BASE}/maps/get-coordinates?address=${encodeURIComponent(ride.destination)}`);
        if (dropoffResponse.ok) {
          const dropoffData = await dropoffResponse.json();
          setDropoffCoords(dropoffData);
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };

    fetchCoordinates();
  }, [ride]);

  const handleStartRide = async () => {
    try {
      if (!otpInput) {
        setShowOtpInput(true);
        return;
      }

      // First refresh the ride data to ensure we have the latest status
      const refreshResponse = await fetch(`${API_BASE}/rides/${rideId}`, {
        credentials: 'include'
      });
      
      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh ride data');
      }
      
      const refreshedRide = await refreshResponse.json();
      console.log('Refreshed ride status:', refreshedRide.status);
      
      // Only allow starting if status is 'accepted'
      if (refreshedRide.status !== 'accepted') {
        throw new Error(`Cannot start ride in ${refreshedRide.status} status. Ride must be accepted first.`);
      }

      console.log('Starting ride with OTP:', otpInput);
      const response = await fetch(`${API_BASE}/rides/start-ride?rideId=${rideId}&otp=${otpInput}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const updatedRide = await response.json();
        console.log('Ride started, updated status:', updatedRide.status);
        setRide(updatedRide);
        
        // Emit ride-started event
        if (socket) {
          socket.emit('ride-started', { 
            rideId,
            status: 'ongoing'
          });
        }
        
        // Clear OTP input and hide the input field
        setOtpInput('');
        setShowOtpInput(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start ride');
      }
    } catch (error) {
      console.error('Error starting ride:', error);
      alert(error.message);
    }
  };

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

  const handleCompleteRide = async () => {
    try {
      const driverId = localStorage.getItem('driverId');
      if (!driverId) {
        throw new Error('Driver ID not found');
      }

      const response = await fetch(`${API_BASE}/rides/end-ride`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          rideId,
          driverId
        })
      });

      if (response.ok) {
        const updatedRide = await response.json();
        setRide(updatedRide);
        
        // Emit ride-completed event
        if (socket) {
          socket.emit('ride-completed', { 
            rideId,
            status: 'completed'
          });
        }
        
        // Navigate back to dashboard after successful completion
        navigate('/driver');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to complete ride');
      }
    } catch (error) {
      console.error('Error completing ride:', error);
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading ride details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => navigate('/driver')} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Ride not found</p>
          <Button onClick={() => navigate('/driver')} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
                  to="/driver"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-4">Ride Details</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-5 w-5 text-primary" />
              <span className="font-medium">Ride #{ride._id}</span>
            </div>
            <span className={`px-3 py-1 rounded-full ${
              ride.status === 'ongoing' 
                ? 'bg-blue-100 text-blue-800'
                : ride.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            } text-sm`}>
              {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Passenger Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Passenger Details</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {ride.user?.fullname?.firstname} {ride.user?.fullname?.lastname}
                </p>
                <p className="text-sm text-gray-500">
                  {ride.user?.phone || 'No phone number'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ride Details */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Ride Information</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">Pickup Location</p>
                <p className="text-gray-600">{ride.pickup}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">Destination</p>
                <p className="text-gray-600">{ride.destination}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Wallet className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Fare</p>
                <p className="text-gray-600">₹{ride.fare}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map with Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            {showNavigation ? 'Navigation' : 'Directions'}
          </h2>
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
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
                  <Popup>
                    Pickup Location<br />
                    {ride.pickup}
                  </Popup>
                </Marker>
                <Marker position={[dropoffCoords.lat, dropoffCoords.lng]}>
                  <Popup>
                    Dropoff Location<br />
                    {ride.destination}
                  </Popup>
                </Marker>
                {showNavigation ? (
                  <NavigationComponent 
                    pickupCoords={pickupCoords} 
                    dropoffCoords={dropoffCoords}
                    ride={ride}
                  />
                ) : (
                  <Routing pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />
                )}
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading map...</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          {/* Show Cancel Ride button only when status is not ongoing */}
          {ride?.status !== 'ongoing' && (
            <Button
              variant="outline"
              onClick={handleCancelClick}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              Cancel Ride
            </Button>
          )}
          
          {/* Show Start Ride button for both accepted and pending status */}
          {(ride?.status === 'accepted' || ride?.status === 'pending') && (
            <>
              {showOtpInput ? (
                <div className="flex-1 flex space-x-2">
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Enter OTP"
                    className="flex-1 px-3 py-2 border rounded-md"
                    maxLength={6}
                  />
                  <Button
                    onClick={handleStartRide}
                    className="flex-1"
                    disabled={!otpInput || otpInput.length !== 6}
                  >
                    Start Ride
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowOtpInput(true)}
                  className="flex-1"
                >
                  Start Ride
                </Button>
              )}
            </>
          )}

          {/* Show Navigation and Complete Ride buttons when status is 'ongoing' */}
          {ride?.status === 'ongoing' && (
            <>
              <Button
                onClick={() => setShowNavigation(!showNavigation)}
                className="flex-1"
              >
                <Navigation className="h-4 w-4 mr-2" />
                {showNavigation ? 'Hide Navigation' : 'Start Navigation'}
              </Button>
              <Button
                onClick={handleCompleteRide}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Complete Ride
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 