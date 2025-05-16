import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon issue with Leaflet + Webpack
import 'leaflet/dist/leaflet.css';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LocationMarker = () => {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    const updatePosition = (pos) => {
      const { latitude, longitude } = pos.coords;
      const newPos = [latitude, longitude];
      setPosition(newPos);
      map.flyTo(newPos, map.getZoom());
    };

    navigator.geolocation.getCurrentPosition(updatePosition);
    const watchId = navigator.geolocation.watchPosition(updatePosition);

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  return position ? <Marker position={position} /> : null;
};

const LiveTracking = ({ pickupCoords, dropoffCoords }) => {
  // Center map on pickup, dropoff, or default
  let center = [22.5726, 88.3639]; // Kolkata default
  if (pickupCoords) center = [pickupCoords.lat, pickupCoords.lng];
  else if (dropoffCoords) center = [dropoffCoords.lat, dropoffCoords.lng];

  const polylinePositions =
    pickupCoords && dropoffCoords
      ? [
          [pickupCoords.lat, pickupCoords.lng],
          [dropoffCoords.lat, dropoffCoords.lng],
        ]
      : null;

  return (
    <MapContainer center={center} zoom={13} className='w-[927px] h-[700px]'>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pickupCoords && <Marker position={[pickupCoords.lat, pickupCoords.lng]} />}
      {dropoffCoords && <Marker position={[dropoffCoords.lat, dropoffCoords.lng]} />}
      {polylinePositions && <Polyline positions={polylinePositions} color="red" />}
      <LocationMarker />
    </MapContainer>
  );
};

export default LiveTracking;
