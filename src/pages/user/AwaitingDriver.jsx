import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LiveTracking from './LiveTracking';
import { Clock } from 'lucide-react';

export default function AwaitingDriver() {
  const location = useLocation();
  const navigate = useNavigate();
  const { ride, pickupCoords, dropoffCoords, distanceTime } = location.state || {};

  React.useEffect(() => {
    if (!ride) navigate('/user/book');
  }, [ride, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
      <h2 className="text-2xl font-bold mb-2">Awaiting Driver</h2>
      <p className="mb-4 text-muted-foreground">Your ride is being assigned to a driver. Please wait...</p>
      <div className="w-full max-w-3xl mb-6">
        <LiveTracking pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />
      </div>
      <div className="bg-card rounded-xl p-6 shadow w-full max-w-md flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-primary" />
          <span className="font-semibold">Estimated Arrival:</span>
          <span className="ml-2">{distanceTime ? `${Math.round(distanceTime.duration)} min` : 'Calculating...'}</span>
        </div>
        <div className="mb-2">
          <span className="font-medium">Pickup:</span> {ride?.pickup}
        </div>
        <div className="mb-2">
          <span className="font-medium">Drop-off:</span> {ride?.destination}
        </div>
        <div className="mb-2">
          <span className="font-medium">Fare:</span> ₹{ride?.fare}
        </div>
        <Button className="mt-4" onClick={() => navigate('/user/book')}>Cancel Ride</Button>
      </div>
    </div>
  );
}
