import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, MapPin, Clock, Bus, Bike, Calendar } from "lucide-react";
import LiveTracking from './LiveTracking';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';

export default function ScheduleRide() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [distanceTime, setDistanceTime] = useState(null);
  const [fare, setFare] = useState({ auto: 0, car: 0, moto: 0 });
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loadingFare, setLoadingFare] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [schedulePeriod, setSchedulePeriod] = useState('once');
  const pickupTimeout = useRef();
  const dropoffTimeout = useRef();
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
  };

  const fetchSuggestions = async (input, setSuggestions) => {
    if (!input || input.length < 3) return setSuggestions([]);
    try {
      const res = await fetch(`${API_BASE}/maps/get-suggestions?input=${encodeURIComponent(input)}`, {
        credentials: 'include'
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch {
      setSuggestions([]);
    }
  };

  const fetchCoordinates = async (address, setCoords) => {
    try {
      const res = await fetch(`${API_BASE}/maps/get-coordinates?address=${encodeURIComponent(address)}`, {
        credentials: 'include'
      });
      const data = await res.json();
      setCoords(data); // data is the coordinates object
    } catch {
      setCoords(null);
    }
  };

  const fetchDistanceTime = async (origin, destination) => {
    try {
      const res = await fetch(`${API_BASE}/maps/get-distance-time?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`, {
        credentials: 'include'
      });
      const data = await res.json();
      setDistanceTime(data);
    } catch {
      setDistanceTime(null);
    }
  };

  React.useEffect(() => {
    if (pickupCoords && dropoffCoords && schedulePeriod) {
      fetchDistanceTime(pickup, dropoff);
      fetchFare(pickup, dropoff, schedulePeriod);
    }
  }, [pickupCoords, dropoffCoords, schedulePeriod]);

  // Update fetchFare to accept period and calculate total fare
  const fetchFare = async (pickup, dropoff, period) => {
    setLoadingFare(true);
    try {
      const res = await fetch(`${API_BASE}/rides/get-fare?pickup=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(dropoff)}`, {
        credentials: 'include'
      });
      const data = await res.json();
      // Calculate total fare based on period
      const periodMultipliers = {
        once: 1,
        '15days': 14,
        '1month': 30,
        '3months': 90,
        '6months': 180,
        '1year': 365
      };
      const periodDiscounts = {
        once: 0,
        '15days': 0.10,
        '1month': 0.15,
        '3months': 0.20,
        '6months': 0.25,
        '1year': 0.30
      };
      const multiplier = periodMultipliers[period] || 1;
      const discount = periodDiscounts[period] || 0;
      const calcFare = (base) => Math.round(base * multiplier * (1 - discount));
      setFare({
        auto: calcFare(data.fare?.auto || 0),
        car: calcFare(data.fare?.car || 0),
        moto: calcFare(data.fare?.moto || 0)
      });
    } catch {
      setFare({ auto: 0, car: 0, moto: 0 });
    }
    setLoadingFare(false);
  };

  const handlePickupChange = (e) => {
    setPickup(e.target.value);
    setPickupCoords(null);
    clearTimeout(pickupTimeout.current);
    pickupTimeout.current = setTimeout(() => {
      fetchSuggestions(e.target.value, setPickupSuggestions);
    }, 300);
  };

  const handleDropoffChange = (e) => {
    setDropoff(e.target.value);
    setDropoffCoords(null);
    clearTimeout(dropoffTimeout.current);
    dropoffTimeout.current = setTimeout(() => {
      fetchSuggestions(e.target.value, setDropoffSuggestions);
    }, 300);
  };

  const selectPickup = (suggestion) => {
    setPickup(suggestion);
    setPickupSuggestions([]);
    fetchCoordinates(suggestion, setPickupCoords);
  };

  const selectDropoff = (suggestion) => {
    setDropoff(suggestion);
    setDropoffSuggestions([]);
    fetchCoordinates(suggestion, setDropoffCoords);
  };

  const periodMap = {
    once: 'one-time',
    '15days': '15-days',
    '1month': '1-month',
    '3months': '3-months',
    '6months': '6-months',
    '1year': '1-year'
  };

  const handleConfirmBooking = async () => {
    setBookingLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      // Combine date and time into ISO string
      const scheduleStartDate = new Date(`${date}T${time}`).toISOString();
      const mappedPeriod = periodMap[schedulePeriod] || 'one-time';
      const res = await fetch(`${API_BASE}/rides/schedule`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          pickup,
          destination: dropoff,
          vehicleType: vehicleTypes[selectedVehicle].type,
          scheduleStartDate,
          schedulePeriod: mappedPeriod
        })
      });
      if (res.ok) {
        const ride = await res.json();
        navigate('/user/scheduled-details', { state: { ride } });
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Scheduling failed!');
      }
    } catch (error) {
      alert('Scheduling failed!');
    }
    setBookingLoading(false);
  };

  // Add useCurrentLocation logic for pickup
  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please use a modern browser.');
      return;
    }
    setPickup('Getting your location...');
    setPickupSuggestions([]);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });
      const { latitude, longitude } = position.coords;
      setPickupCoords({ lat: latitude, lng: longitude });
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
          break;
        } catch (error) {
          retryCount++;
          if (retryCount === maxRetries) {
            setPickup(`${latitude},${longitude}`);
          } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
    } catch (error) {
      setPickup('');
      setPickupCoords(null);
    }
  };

  // Add useCurrentLocation logic for dropoff
  const handleUseCurrentDropoffLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please use a modern browser.');
      return;
    }
    setDropoff('Getting your location...');
    setDropoffSuggestions([]);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });
      const { latitude, longitude } = position.coords;
      setDropoffCoords({ lat: latitude, lng: longitude });
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
            setDropoff(`Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
    } catch (error) {
      setDropoff('');
      setDropoffCoords(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-xl border overflow-hidden" style={{ height: '600px' }}>
        <LiveTracking pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />
      </div>
      <div className="space-y-6">
        {step === 1 && (
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Schedule a Ride</h2>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input type="time" value={time} onChange={e => setTime(e.target.value)} required />
                </div>
              </div>
              <div>
                <Label>Schedule Period</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  value={schedulePeriod}
                  onChange={e => setSchedulePeriod(e.target.value)}
                  required
                >
                  <option value="once">One Time</option>
                  <option value="15days">15 Days</option>
                  <option value="1month">1 Month</option>
                  <option value="3months">3 Months</option>
                  <option value="6months">6 Months</option>
                  <option value="1year">1 Year</option>
                </select>
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
                disabled={!pickupCoords || !dropoffCoords || !date || !time}
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
                const VehicleIcon = vehicle.icon;
                return (
                  <div 
                    key={key}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer hover:border-primary ${selectedVehicle === key ? 'border-primary bg-primary/5' : ''}`}
                    onClick={() => {
                      setSelectedVehicle(key);
                      setStep(3);
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
                      <p className="text-sm text-muted-foreground">Available for schedule</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {step === 3 && selectedVehicle && (
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Confirm Scheduled Ride</h2>
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
                  <p className="text-sm">Scheduled for: {date} {time}</p>
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
                {bookingLoading ? 'Scheduling...' : 'Confirm Schedule'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
