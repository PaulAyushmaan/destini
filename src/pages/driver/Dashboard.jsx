import { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Car, Clock, MapPin, Wallet, ArrowUp, ArrowDown } from 'lucide-react';
import { SocketContext } from '../../../SocketContext'; // Fixed path to root directory

export default function Dashboard() {
  const { socket, confirmedRide, setConfirmedRide } = useContext(SocketContext);
  const [currentRide, setCurrentRide] = useState(null);
  
  // Join the driver room when component mounts
  useEffect(() => {
    // Get the driver ID from your auth system
    const driverId = localStorage.getItem('driverId'); // Adjust based on your auth implementation
    if (driverId) {
      socket.emit('join', { userId: driverId, userType: 'captain' });
    }
  }, [socket]);
  
  // Handle confirmed rides
  useEffect(() => {
    if (confirmedRide) {
      console.log('New ride confirmation received:', confirmedRide);
      setCurrentRide(confirmedRide);
      // Reset the confirmedRide state to avoid duplicate processing
      setConfirmedRide(null);
    }
  }, [confirmedRide, setConfirmedRide]);

  return (
    <div className="grid gap-6">
      {/* Status and Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="col-span-1 md:col-span-2 rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Driver Status</h3>
              <p className="text-sm text-muted-foreground">Toggle availability</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">Today's Earnings</p>
            <h3 className="text-2xl font-bold">₹ 125.50</h3>
            <p className="text-sm text-green-500 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              15% from yesterday
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">Completed Rides</p>
            <h3 className="text-2xl font-bold">8</h3>
            <p className="text-sm text-muted-foreground">Today</p>
          </div>
        </div>
      </div>

      {/* Current/Next Ride - Now dynamically populated */}
      <div className="rounded-xl border bg-card">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">Current Ride</h2>
        </div>
        <div className="p-6">
          {currentRide ? (
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{currentRide.user?.fullname?.firstname || 'Passenger'}</h4>
                  <span className="text-sm text-muted-foreground">₹{currentRide.fare}</span>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{currentRide.pickup}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{currentRide.destination}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm">Start Ride</Button>
                  <Button size="sm" variant="outline">Contact Passenger</Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No active rides at the moment</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-card">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {/* Completed Ride */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Downtown to Campus</h4>
                  <span className="text-sm text-muted-foreground">₹550.75</span>
                </div>
                <p className="text-sm text-muted-foreground">March 27, 2024 - 2:30 PM</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    Completed
                  </span>
                  <span className="text-sm text-muted-foreground">4.8 ★</span>
                </div>
              </div>
            </div>

            {/* Completed Ride */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Campus to Shopping Mall</h4>
                  <span className="text-sm text-muted-foreground">₹220.50</span>
                </div>
                <p className="text-sm text-muted-foreground">March 27, 2024 - 1:15 PM</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    Completed
                  </span>
                  <span className="text-sm text-muted-foreground">5.0 ★</span>
                </div>
              </div>
            </div>

            {/* Cancelled Ride */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Campus to Airport</h4>
                  <span className="text-sm text-muted-foreground">₹350.00</span>
                </div>
                <p className="text-sm text-muted-foreground">March 27, 2024 - 11:45 AM</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                    Cancelled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}