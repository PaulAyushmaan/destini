import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, MapPin, Clock, Bus, Bike } from "lucide-react"
import LiveTracking from './LiveTracking'

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
    setBookingLoading(true)
    try {
      const res = await fetch(`${API_BASE}/ride/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          pickup,
          destination: dropoff,
          vehicleType: selectedVehicle
        })
      })
      if (res.ok) {
        alert('Booking confirmed!')
      } else {
        alert('Booking failed!')
      }
    } catch {
      alert('Booking failed!')
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
                  {selectedVehicle === 'shuttle' && <Bus className="h-4 w-4 text-muted-foreground" />}
                  {selectedVehicle === 'cab' && <Car className="h-4 w-4 text-muted-foreground" />}
                  {selectedVehicle === 'toto' && <Bike className="h-4 w-4 text-muted-foreground" />}
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