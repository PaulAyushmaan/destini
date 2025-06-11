import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, MapPin, Clock, Bus, Bike } from "lucide-react"
import LiveTracking from './LiveTracking'
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:4000'; // Change to your backend base path if needed

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
  const pickupTimeout = useRef()
  const dropoffTimeout = useRef()
  const navigate = useNavigate();

  const vehicleTypes = {
    auto: {
      name: "Campus Shuttle",
      icon: Bus,
      basePrice: 20,
      perKmRate: 5,
      description: "Shared • AC • Most economical",
      capacity: "20+ seats",
      waitTime: "~10-15 mins",
      type: "auto"
    },
    car: {
      name: "Private Cab",
      icon: Car,
      basePrice: 50,
      perKmRate: 12,
      description: "4 seats • AC • Best for groups",
      capacity: "4 seats",
      waitTime: "~5 mins",
      type: "car"
    },
    moto: {
      name: "Electric Toto",
      icon: Bike,
      basePrice: 30,
      perKmRate: 8,
      description: "3 seats • Eco-friendly",
      capacity: "3 seats",
      waitTime: "~3-5 mins",
      type: "moto"
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
      alert('Geolocation is not supported by your browser. Please use a modern browser.');
      return;
    }

    // Show loading state
    setPickup('Getting your location...');
    setPickupSuggestions([]);

    try {
      // First try with high accuracy
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      });

      const { latitude, longitude } = position.coords;
      
      // Set coordinates immediately
      setPickupCoords({ lat: latitude, lng: longitude });

      // Try to get address with retry
      let retryCount = 0;
      const maxRetries = 2;

      while (retryCount < maxRetries) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': 'DestiniApp/1.0'
              }
            }
          );
          
          if (!res.ok) throw new Error('Geocoding failed');
          
          const data = await res.json();
          const address = data.display_name || `${latitude},${longitude}`;
          setPickup(address);
          break; // Success, exit loop
        } catch (error) {
          retryCount++;
          if (retryCount === maxRetries) {
            // If all retries failed, use coordinates
            setPickup(`${latitude},${longitude}`);
          } else {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
    } catch (error) {
      console.error('Location error:', error);
      
      // Try again with lower accuracy if high accuracy fails
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 30000
            }
          );
        });

        const { latitude, longitude } = position.coords;
        setPickupCoords({ lat: latitude, lng: longitude });
        setPickup(`${latitude},${longitude}`);
      } catch (fallbackError) {
        console.error('Fallback location error:', fallbackError);
        
        // Show specific error message based on error code
        switch (fallbackError.code) {
          case fallbackError.PERMISSION_DENIED:
            alert('Location access denied. Please enable location services in your browser settings.');
            break;
          case fallbackError.POSITION_UNAVAILABLE:
            alert('Location information is unavailable. Please check your device\'s location settings.');
            break;
          case fallbackError.TIMEOUT:
            alert('Location request timed out. Please try again.');
            break;
          default:
            alert('Unable to get your location. Please check your location settings and try again.');
        }
        
        setPickup('');
        setPickupCoords(null);
      }
    }
  };

  const handleUseCurrentDropoffLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please use a modern browser.');
      return;
    }

    // Show loading state
    setDropoff('Getting your location...');
    setDropoffSuggestions([]);

    try {
      // First try with high accuracy
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      });

      const { latitude, longitude } = position.coords;
      
      // Set coordinates immediately
      setDropoffCoords({ lat: latitude, lng: longitude });

      // Try to get address with retry
      let retryCount = 0;
      const maxRetries = 2;
      let addressFound = false;

      while (retryCount < maxRetries && !addressFound) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': 'DestiniApp/1.0'
              }
            }
          );
          
          if (!res.ok) throw new Error('Geocoding failed');
          
          const data = await res.json();
          if (data.display_name) {
            setDropoff(data.display_name);
            addressFound = true;
          } else {
            throw new Error('No address found');
          }
        } catch (error) {
          retryCount++;
          if (retryCount === maxRetries) {
            // If all retries failed, try one more time with a different zoom level
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
                {
                  headers: {
                    'Accept-Language': 'en-US,en;q=0.9',
                    'User-Agent': 'DestiniApp/1.0'
                  }
                }
              );
              
              if (res.ok) {
                const data = await res.json();
                if (data.display_name) {
                  setDropoff(data.display_name);
                  addressFound = true;
                }
              }
            } catch (finalError) {
              console.error('Final geocoding attempt failed:', finalError);
            }
            
            if (!addressFound) {
              // If still no address, use a formatted coordinate string
              setDropoff(`Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            }
          } else {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
    } catch (error) {
      console.error('Location error:', error);
      
      // Try again with lower accuracy if high accuracy fails
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 30000
            }
          );
        });

        const { latitude, longitude } = position.coords;
        setDropoffCoords({ lat: latitude, lng: longitude });
        
        // Try to get address one last time
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': 'DestiniApp/1.0'
              }
            }
          );
          
          if (res.ok) {
            const data = await res.json();
            if (data.display_name) {
              setDropoff(data.display_name);
            } else {
              setDropoff(`Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            }
          } else {
            setDropoff(`Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          }
        } catch (geocodeError) {
          setDropoff(`Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
      } catch (fallbackError) {
        console.error('Fallback location error:', fallbackError);
        
        // Show specific error message based on error code
        switch (fallbackError.code) {
          case fallbackError.PERMISSION_DENIED:
            alert('Location access denied. Please enable location services in your browser settings.');
            break;
          case fallbackError.POSITION_UNAVAILABLE:
            alert('Location information is unavailable. Please check your device\'s location settings.');
            break;
          case fallbackError.TIMEOUT:
            alert('Location request timed out. Please try again.');
            break;
          default:
            alert('Unable to get your location. Please check your location settings and try again.');
        }
        
        setDropoff('');
        setDropoffCoords(null);
      }
    }
  };

  React.useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      fetchDistanceTime(pickup, dropoff)
      fetchFare(pickup, dropoff)
    }
  }, [pickupCoords, dropoffCoords])

  const handleConfirmBooking = async () => {
    setBookingLoading(true)
    try {
      // Get token from localStorage if it exists
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const res = await fetch(`${API_BASE}/rides/create`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          pickup,
          destination: dropoff,
          vehicleType: vehicleTypes[selectedVehicle].type
        })
      })
      if (res.ok) {
        const ride = await res.json();
        navigate(`/user/awaiting-driver/${ride._id}`, { state: { ride, pickupCoords, dropoffCoords, distanceTime } });
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Booking failed!');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed!');
    }
    setBookingLoading(false)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-xl border overflow-hidden" style={{ height: '600px' }}>
        <LiveTracking pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />
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

        {step === 2 && (
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Select Vehicle</h2>
            <div className="space-y-4">
              {Object.entries(vehicleTypes).map(([key, vehicle]) => {
                const VehicleIcon = vehicle.icon
                return (
                  <div 
                    key={key}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer hover:border-primary ${selectedVehicle === key ? 'border-primary bg-primary/5' : ''}`}
                    onClick={() => {
                      setSelectedVehicle(key)
                      setStep(3)
                    }}
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <VehicleIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{vehicle.name}</h3>
                      <p className="text-sm text-muted-foreground">{vehicle.description}</p>
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        <span>{vehicle.capacity}</span>
                        <span>{vehicle.waitTime}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{fare[key]}</p>
                      <p className="text-sm text-muted-foreground">Available now</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {step === 3 && selectedVehicle && (
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Confirm Booking</h2>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{pickup}</p>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{dropoff}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">Estimated arrival: {vehicleTypes[selectedVehicle].waitTime}</p>
                </div>
                <div className="flex items-center gap-3">
                  {selectedVehicle === 'auto' && <Bus className="h-4 w-4 text-muted-foreground" />}
                  {selectedVehicle === 'car' && <Car className="h-4 w-4 text-muted-foreground" />}
                  {selectedVehicle === 'moto' && <Bike className="h-4 w-4 text-muted-foreground" />}
                  <p className="text-sm">{vehicleTypes[selectedVehicle].name} • ₹{fare[selectedVehicle]}</p>
                </div>
                {distanceTime && (
                  <div className="text-xs text-muted-foreground mt-2">Distance: {distanceTime.distance} | Time: {distanceTime.time}</div>
                )}
              </div>

              <Button className="w-full" onClick={handleConfirmBooking} disabled={bookingLoading}>
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}