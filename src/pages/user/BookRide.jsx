import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, MapPin, Clock, Bus, Bike } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { io } from "socket.io-client"
import LiveTracking from './LiveTracking'

const API_BASE = 'http://localhost:4000';

export default function BookRide() {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [dropoffSuggestions, setDropoffSuggestions] = useState([])
  const [pickupCoords, setPickupCoords] = useState(null)
  const [dropoffCoords, setDropoffCoords] = useState(null)
  const [distanceTime, setDistanceTime] = useState(null)
  const [fare, setFare] = useState({
    auto: 0,
    car: 0,
    moto: 0
  })
  const [step, setStep] = useState(1)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [loadingFare, setLoadingFare] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [currentRide, setCurrentRide] = useState(null)
  const [socket, setSocket] = useState(null)
  const { toast } = useToast()
  const pickupTimeout = useRef()
  const dropoffTimeout = useRef()

  useEffect(() => {
    // Initialize socket connection
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token); // Debug log

    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Please login to continue",
        variant: "destructive"
      });
      return;
    }

    // Verify token format
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }
      console.log('Token format is valid'); // Debug log
    } catch (error) {
      console.error('Token validation error:', error);
      toast({
        title: "Invalid Token",
        description: "Please login again",
        variant: "destructive"
      });
      return;
    }

    const newSocket = io(API_BASE, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'] // Explicitly set transport methods
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      toast({
        title: "Connected",
        description: "Successfully connected to server",
      });
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      console.error('Error details:', {
        message: error.message,
        description: error.description,
        type: error.type
      });
      toast({
        title: "Connection Error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive"
      });
    });

    newSocket.on('ride-confirmed', (ride) => {
      setCurrentRide(ride);
      toast({
        title: "Ride Confirmed",
        description: "A driver has accepted your ride request",
      });
      setStep(3); // Move to ride tracking step
    });

    newSocket.on('ride-status-changed', (data) => {
      if (currentRide && currentRide._id === data.rideId) {
        setCurrentRide(prev => ({ ...prev, status: data.status }));
        if (data.status === 'ongoing') {
          toast({
            title: "Ride Started",
            description: "Your ride has started",
          });
        } else if (data.status === 'completed') {
          toast({
            title: "Ride Completed",
            description: "Your ride has been completed",
          });
          setCurrentRide(null);
          setStep(1);
        }
      }
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const vehicleTypes = {
    shuttle: {
      name: "Campus Shuttle",
      icon: Bus,
      basePrice: 20,
      perKmRate: 5,
      description: "Shared • AC • Most economical",
      capacity: "20+ seats",
      waitTime: "~10-15 mins",
      type: "shuttle"
    },
    cab: {
      name: "Private Cab",
      icon: Car,
      basePrice: 50,
      perKmRate: 12,
      description: "4 seats • AC • Best for groups",
      capacity: "4 seats",
      waitTime: "~5 mins",
      type: "cab"
    },
    toto: {
      name: "Electric Toto",
      icon: Bike,
      basePrice: 30,
      perKmRate: 8,
      description: "3 seats • Eco-friendly",
      capacity: "3 seats",
      waitTime: "~3-5 mins",
      type: "toto"
    }
  }

  const fetchSuggestions = async (input, setSuggestions) => {
    if (!input || input.length < 3) return setSuggestions([])
    try {
      const res = await fetch(`${API_BASE}/maps/get-suggestions?input=${encodeURIComponent(input)}`, {
        credentials: 'include'
      })
      const data = await res.json()
      setSuggestions(data.suggestions || [])
    } catch {
      setSuggestions([])
    }
  }

  const fetchCoordinates = async (address, setCoords) => {
    try {
      const res = await fetch(`${API_BASE}/maps/get-coordinates?address=${encodeURIComponent(address)}`, {
        credentials: 'include'
      })
      const data = await res.json()
      setCoords(data) // data is the coordinates object
    } catch {
      setCoords(null)
    }
  }

  const fetchDistanceTime = async (origin, destination) => {
    try {
      const res = await fetch(`${API_BASE}/maps/get-distance-time?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`, {
        credentials: 'include'
      })
      console.log(res)
      const data = await res.json()
      console.log(data)
      setDistanceTime(data)
    } catch {
      setDistanceTime(null)
    }
  }

  const fetchFare = async (pickup, dropoff) => {
    setLoadingFare(true)
    try {
      const res = await fetch(`${API_BASE}/rides/get-fare?pickup=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(dropoff)}`, {
        credentials: 'include'
      })
      const data = await res.json()
      console.log(data)
      setFare(data.fare || { shuttle: 0, cab: 0, toto: 0 })
    } catch {
      setFare({ shuttle: 0, cab: 0, toto: 0 })
    }
    setLoadingFare(false)
  }

  const handlePickupChange = (e) => {
    setPickup(e.target.value)
    setPickupCoords(null)
    clearTimeout(pickupTimeout.current)
    pickupTimeout.current = setTimeout(() => {
      fetchSuggestions(e.target.value, setPickupSuggestions)
    }, 300)
  }

  const handleDropoffChange = (e) => {
    setDropoff(e.target.value)
    setDropoffCoords(null)
    clearTimeout(dropoffTimeout.current)
    dropoffTimeout.current = setTimeout(() => {
      fetchSuggestions(e.target.value, setDropoffSuggestions)
    }, 300)
  }

  const selectPickup = (suggestion) => {
    setPickup(suggestion)
    setPickupSuggestions([])
    fetchCoordinates(suggestion, setPickupCoords)
  }

  const selectDropoff = (suggestion) => {
    setDropoff(suggestion)
    setDropoffSuggestions([])
    fetchCoordinates(suggestion, setDropoffCoords)
  }

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      // Use a reverse geocoding API (e.g., Nominatim OpenStreetMap)
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        const address = data.display_name || `${latitude},${longitude}`;
        setPickup(address);
        setPickupSuggestions([]);
        setPickupCoords({ lat: latitude, lng: longitude });
      } catch {
        setPickup(`${latitude},${longitude}`);
        setPickupSuggestions([]);
        setPickupCoords({ lat: latitude, lng: longitude });
      }
    }, () => {
      alert('Unable to retrieve your location.');
    });
  };

  const handleUseCurrentDropoffLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        const address = data.display_name || `${latitude},${longitude}`;
        setDropoff(address);
        setDropoffSuggestions([]);
        setDropoffCoords({ lat: latitude, lng: longitude });
      } catch {
        setDropoff(`${latitude},${longitude}`);
        setDropoffSuggestions([]);
        setDropoffCoords({ lat: latitude, lng: longitude });
      }
    }, () => {
      alert('Unable to retrieve your location.');
    });
  };

  React.useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      fetchDistanceTime(pickup, dropoff)
      fetchFare(pickup, dropoff)
    }
  }, [pickupCoords, dropoffCoords])

  const handleConfirmBooking = async () => {
    setBookingLoading(true);
    try {
      const res = await fetch(`${API_BASE}/rides/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          pickup,
          destination: dropoff,
          vehicleType: selectedVehicle
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setCurrentRide(data);
        toast({
          title: "Booking Confirmed",
          description: "Waiting for a driver to accept your ride",
        });
        setStep(2); // Move to waiting for driver step
      } else {
        toast({
          title: "Booking Failed",
          description: data.message || "Failed to book ride",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book ride",
        variant: "destructive"
      });
    }
    setBookingLoading(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-xl border overflow-hidden" style={{ height: '600px' }}>
        <LiveTracking 
          pickupCoords={pickupCoords} 
          dropoffCoords={dropoffCoords}
          currentRide={currentRide}
        />
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Enter Location</h2>
            <div className="space-y-4">
              <div>
                <Label>Pickup Location</Label>
                <div className="flex gap-2 relative">
                  <Input 
                    placeholder="Enter pickup location"
                    value={pickup}
                    onChange={handlePickupChange}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleUseCurrentLocation}
                    title="Use my current location"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                  {pickupSuggestions.length > 0 && (
                    <div className="absolute z-10 bg-white border rounded w-full top-full left-0 shadow">
                      {pickupSuggestions.map((s, i) => (
                        <div key={i} className="px-3 py-2 hover:bg-primary/10 cursor-pointer" onClick={() => selectPickup(s)}>{s}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Drop-off Location</Label>
                <div className="flex gap-2 relative">
                  <Input 
                    placeholder="Enter drop-off location"
                    value={dropoff}
                    onChange={handleDropoffChange}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleUseCurrentDropoffLocation}
                    title="Use my current location"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                  {dropoffSuggestions.length > 0 && (
                    <div className="absolute z-10 bg-white border rounded w-full top-full left-0 shadow">
                      {dropoffSuggestions.map((s, i) => (
                        <div key={i} className="px-3 py-2 hover:bg-primary/10 cursor-pointer" onClick={() => selectDropoff(s)}>{s}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-primary/10 p-4">
                <h3 className="font-semibold mb-2">Estimated Fares</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Campus Shuttle</span>
                    <span className="font-medium">₹{loadingFare ? '...' : fare.auto}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Private Cab</span>
                    <span className="font-medium">₹{loadingFare ? '...' : fare.car}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Electric Toto</span>
                    <span className="font-medium">₹{loadingFare ? '...' : fare.moto}</span>
                  </div>
                  {distanceTime && (
                    <div className="text-xs text-muted-foreground mt-2">Distance: {Math.round(distanceTime.distance)}km | Time: {Math.round(distanceTime.duration)} Minutes</div>
                  )}
                </div>
              </div>

              <Button 
                className="w-full" 
                disabled={!pickupCoords || !dropoffCoords}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && currentRide && (
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Waiting for Driver</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pickup</p>
                  <p className="font-medium">{currentRide.pickup}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium">{currentRide.destination}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle Type</p>
                  <p className="font-medium">{selectedVehicle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fare</p>
                  <p className="font-medium">₹{currentRide.fare}</p>
                </div>
              </div>
              <div className="pt-4">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => {
                    setCurrentRide(null);
                    setStep(1);
                  }}
                >
                  Cancel Ride
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && currentRide && (
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Ride in Progress</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Driver</p>
                  <p className="font-medium">{currentRide.captain?.name || 'Loading...'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle</p>
                  <p className="font-medium">{currentRide.captain?.vehicleDetails?.model || 'Loading...'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pickup</p>
                  <p className="font-medium">{currentRide.pickup}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium">{currentRide.destination}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{currentRide.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fare</p>
                  <p className="font-medium">₹{currentRide.fare}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}