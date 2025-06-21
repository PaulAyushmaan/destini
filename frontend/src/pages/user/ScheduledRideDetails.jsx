import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Calendar, Car, Bus, Bike, BadgeCheck, ArrowLeft, ArrowRight } from 'lucide-react';

const vehicleIcons = {
  auto: Bus,
  car: Car,
  moto: Bike
};

const periodLabels = {
  'one-time': 'One Time',
  '15-days': '15 Days',
  '1-month': '1 Month',
  '3-months': '3 Months',
  '6-months': '6 Months',
  '1-year': '1 Year'
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  ongoing: 'bg-green-100 text-green-800',
  completed: 'bg-green-200 text-green-900',
  cancelled: 'bg-red-100 text-red-800',
  scheduled: 'bg-purple-100 text-purple-800'
};

export default function ScheduledRideDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;

  if (!ride) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-lg">No scheduled ride details found.</p>
        <Button className="mt-4" onClick={() => navigate('/user/schedule')}>Back to Schedule</Button>
      </div>
    );
  }

  const VehicleIcon = vehicleIcons[ride.vehicleType] || Car;
  const status = ride.status || 'scheduled';
  const statusClass = statusColors[status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card className="shadow-xl border-2 border-primary/30 bg-gradient-to-br from-white via-primary/5 to-primary/10">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Button>
            <Calendar className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold tracking-tight">Scheduled Ride</CardTitle>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusClass}`}>{status}</span>
        </CardHeader>
        <CardContent className="space-y-6 py-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                  <VehicleIcon className="h-7 w-7 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">{ride.vehicleType.charAt(0).toUpperCase() + ride.vehicleType.slice(1)}</span>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-base">{ride.pickup}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-600" />
                  <span className="font-semibold text-base">{ride.destination}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">{ride.scheduleStartDate ? new Date(ride.scheduleStartDate).toLocaleDateString() : '-'}</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">{ride.scheduleStartDate ? new Date(ride.scheduleStartDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                <BadgeCheck className="h-4 w-4 text-primary" />
                <span className="font-medium">{periodLabels[ride.schedulePeriod] || ride.schedulePeriod || '-'}</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                <span className="font-semibold">Fare:</span>
                <span className="text-primary font-bold text-lg">₹{ride.fare}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span>Distance:</span>
                <span className="font-medium">{ride.distance ? `${(ride.distance / 1000).toFixed(2)} km` : '-'}</span>
                <span className="ml-4">Duration:</span>
                <span className="font-medium">{ride.duration ? `${Math.round(ride.duration)} min` : '-'}</span>
              </div>
            </div>
          </div>
          <Button className="w-full mt-6" size="lg" onClick={() => navigate('/user/manage-scheduled')}>
            Go to My Rides <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
