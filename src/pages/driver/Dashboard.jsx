import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Car, Clock, MapPin, Wallet, ArrowUp, ArrowDown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast";
import { io } from "socket.io-client";
import axios from "axios";

export default function Dashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);
  const [socket, setSocket] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize socket connection
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Please login to continue",
        variant: "destructive"
      });
      return;
    }

    const newSocket = io('http://localhost:4000', {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
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
      toast({
        title: "Connection Error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive"
      });
    });

    newSocket.on('new-ride', (ride) => {
      toast({
        title: "New Ride Request",
        description: `Pickup: ${ride.pickup}, Destination: ${ride.destination}`,
        action: (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => handleConfirmRide(ride._id)}
            >
              Accept
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleRejectRide(ride._id)}
            >
              Reject
            </Button>
          </div>
        ),
      });
    });

    newSocket.on('ride-confirmation-success', (ride) => {
      setCurrentRide(ride);
      toast({
        title: "Ride Confirmed",
        description: "You have successfully accepted the ride",
      });
    });

    newSocket.on('ride-status-changed', (data) => {
      if (currentRide && currentRide._id === data.rideId) {
        setCurrentRide(prev => ({ ...prev, status: data.status }));
      }
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const handleConfirmRide = async (rideId) => {
    try {
      const response = await axios.post('http://localhost:4000/rides/confirm', {
        rideId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data) {
        setCurrentRide(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to confirm ride",
        variant: "destructive"
      });
    }
  };

  const handleRejectRide = (rideId) => {
    // Implement reject ride logic
    toast({
      title: "Ride Rejected",
      description: "You have rejected this ride request"
    });
  };

  const handleStartRide = async () => {
    if (!currentRide) return;

    try {
      const response = await axios.get(`http://localhost:4000/rides/start-ride`, {
        params: {
          rideId: currentRide._id,
          otp: currentRide.otp
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data) {
        setCurrentRide(response.data);
        toast({
          title: "Ride Started",
          description: "You have started the ride"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to start ride",
        variant: "destructive"
      });
    }
  };

  const handleEndRide = async () => {
    if (!currentRide) return;

    try {
      const response = await axios.post('http://localhost:4000/rides/end-ride', {
        rideId: currentRide._id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data) {
        setCurrentRide(null);
        toast({
          title: "Ride Ended",
          description: "You have completed the ride"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to end ride",
        variant: "destructive"
      });
    }
  };

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
            <Switch 
              checked={isOnline} 
              onCheckedChange={setIsOnline}
            />
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

      {/* Current/Next Ride */}
      {currentRide && (
        <div className="rounded-xl border bg-card">
          <div className="border-b p-6">
            <h2 className="text-xl font-semibold">Current Ride</h2>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{currentRide.user.name}</h4>
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
                  {currentRide.status === 'accepted' && (
                    <Button size="sm" onClick={handleStartRide}>Start Ride</Button>
                  )}
                  {currentRide.status === 'ongoing' && (
                    <Button size="sm" onClick={handleEndRide}>End Ride</Button>
                  )}
                  <Button size="sm" variant="outline">Contact Passenger</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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