import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, MapPin, Clock, Calendar, Bus, Bike } from "lucide-react"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Replace with your Mapbox access token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'

export default function BookRide() {
  const [map, setMap] = useState(null)
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [pickupCoords, setPickupCoords] = useState(null)
  const [dropoffCoords, setDropoffCoords] = useState(null)
  const [fare, setFare] = useState(null)
  const [step, setStep] = useState(1) // 1: Location, 2: Vehicle, 3: Confirm
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  // Vehicle types with their pricing models
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

  useEffect(() => {
    // Initialize map
    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [78.9629, 20.5937], // India center coordinates
      zoom: 4
    })

    mapInstance.addControl(new mapboxgl.NavigationControl())
    setMap(mapInstance)

    return () => mapInstance.remove()
  }, [])

  const searchLocation = async (query, type) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}`
      )
      const data = await response.json()
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center
        const coords = { lng, lat }
        
        if (type === 'pickup') {
          setPickupCoords(coords)
          addMarker(coords, 'pickup')
        } else {
          setDropoffCoords(coords)
          addMarker(coords, 'dropoff')
        }

        // If both locations are set, draw route
        if (pickupCoords && dropoffCoords) {
          drawRoute()
        }
      }
    } catch (error) {
      console.error('Error searching location:', error)
    }
  }

  const addMarker = (coords, type) => {
    const marker = new mapboxgl.Marker({
      color: type === 'pickup' ? '#22c55e' : '#ef4444'
    })
      .setLngLat([coords.lng, coords.lat])
      .addTo(map)

    // Fly to marker
    map.flyTo({
      center: [coords.lng, coords.lat],
      zoom: 14
    })
  }

  const calculateFare = (distance, vehicleType) => {
    const vehicle = vehicleTypes[vehicleType]
    return Math.round(vehicle.basePrice + (distance * vehicle.perKmRate))
  }

  const drawRoute = async () => {
    if (!pickupCoords || !dropoffCoords) return

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoords.lng},${pickupCoords.lat};${dropoffCoords.lng},${dropoffCoords.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      )
      const data = await response.json()

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0]
        const distance = route.distance / 1000 // Convert to kilometers

        // Calculate fares for all vehicle types
        const fares = {
          shuttle: calculateFare(distance, 'shuttle'),
          cab: calculateFare(distance, 'cab'),
          toto: calculateFare(distance, 'toto')
        }
        setFare(fares)

        // Draw route on map
        if (map.getSource('route')) {
          map.getSource('route').setData({
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          })
        } else {
          map.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: route.geometry
              }
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 4,
              'line-opacity': 0.75
            }
          })
        }
      }
    } catch (error) {
      console.error('Error getting directions:', error)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Map */}
      <div className="lg:col-span-2 rounded-xl border overflow-hidden" style={{ height: '600px' }}>
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
      </div>

      {/* Booking Panel */}
      <div className="space-y-6">
        {step === 1 && (
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Enter Location</h2>
            <div className="space-y-4">
              <div>
                <Label>Pickup Location</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter pickup location"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => searchLocation(pickup, 'pickup')}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Drop-off Location</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter drop-off location"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => searchLocation(dropoff, 'dropoff')}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {fare && (
                <div className="rounded-lg bg-primary/10 p-4">
                  <h3 className="font-semibold mb-2">Estimated Fares</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Campus Shuttle</span>
                      <span className="font-medium">₹{fare.shuttle}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Private Cab</span>
                      <span className="font-medium">₹{fare.cab}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Electric Toto</span>
                      <span className="font-medium">₹{fare.toto}</span>
                    </div>
                  </div>
                </div>
              )}

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
              </div>

              <Button className="w-full" onClick={() => alert('Booking confirmed!')}>
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 