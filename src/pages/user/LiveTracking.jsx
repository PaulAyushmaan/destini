import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon issue with Leaflet + Webpack
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Create a custom icon for current location
const currentLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const map = useMap();

  useEffect(() => {
    let watchId = null;
    let timeoutId = null;

    const updatePosition = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      const newPosition = [latitude, longitude];
      
      // Convert accuracy to meters if it's in a different unit
      const accuracyInMeters = accuracy > 1000 ? accuracy / 1000 : accuracy;
      
      // Accept positions with accuracy up to 500 meters
      if (accuracyInMeters <= 1000) {
        setPosition(newPosition);
        setAccuracy(accuracyInMeters);
        
        // Center map on current position if it's the first update
        if (!position) {
          map.setView(newPosition, 15);
        }
      } else {
        console.log('Low accuracy position ignored:', accuracyInMeters, 'meters');
      }
    };

    const handleError = (error) => {
      console.error('Geolocation error:', error);
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert('Please enable location access to use this feature.');
          break;
        case error.POSITION_UNAVAILABLE:
          alert('Location information is unavailable.');
          break;
        case error.TIMEOUT:
          alert('Location request timed out.');
          break;
        default:
          alert('An unknown error occurred.');
      }
    };

    const startTracking = () => {
      // First get a single high-accuracy position
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updatePosition(pos);
          // Then start watching position
          watchId = navigator.geolocation.watchPosition(
            updatePosition,
            handleError,
            {
              enableHighAccuracy: true,
              timeout: 30000,        // Increased timeout
              maximumAge: 0,         // Don't use cached positions
              requireHighAccuracy: true  // Force high accuracy
            }
          );
        },
        handleError,
        {
          enableHighAccuracy: true,
          timeout: 30000,        // Increased timeout
          maximumAge: 0,         // Don't use cached positions
          requireHighAccuracy: true  // Force high accuracy
        }
      );
    };

    // Start tracking with a small delay to ensure map is ready
    timeoutId = setTimeout(startTracking, 1000);

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [map, position]);

  return position ? (
    <Marker 
      position={position}
      icon={currentLocationIcon}
    >
      <Popup>
        You are here
        {accuracy && <br />}
        {accuracy && `Accuracy: ${Math.round(accuracy)} meters`}
      </Popup>
    </Marker>
  ) : null;
}

const LiveTracking = ({ pickupCoords, dropoffCoords }) => {
  // Center map on pickup, dropoff, or default
  let center = [22.5726, 88.3639]; // Kolkata default
  if (pickupCoords) center = [pickupCoords.lat, pickupCoords.lng];
  else if (dropoffCoords) center = [dropoffCoords.lat, dropoffCoords.lng];

  return (
    <MapContainer center={center} zoom={13} className='w-[927px] h-[700px]'>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pickupCoords && <Marker position={[pickupCoords.lat, pickupCoords.lng]} />}
      {dropoffCoords && <Marker position={[dropoffCoords.lat, dropoffCoords.lng]} />}
      {pickupCoords && dropoffCoords && (
        <Routing pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />
      )}
      <LocationMarker />
    </MapContainer>
  );
};

export default LiveTracking;
