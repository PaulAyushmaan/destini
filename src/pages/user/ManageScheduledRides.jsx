import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Clock, BadgeCheck, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EditScheduledRideModal from './EditScheduledRideModal';

const vehicleLabels = {
  auto: 'Campus Shuttle',
  car: 'Private Cab',
  moto: 'Electric Toto'
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
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  accepted: 'bg-blue-50 text-blue-700 border-blue-200',
  ongoing: 'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-green-100 text-green-900 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  scheduled: 'bg-purple-50 text-purple-700 border-purple-200'
};

export default function ManageScheduledRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ open: false, ride: null });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRides() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:4000'}/rides/scheduled`, {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include'
        });
        const data = await res.json();
        setRides(data.rides || []);
      } catch {
        setRides([]);
      }
      setLoading(false);
    }
    fetchRides();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary"><Calendar className="h-6 w-6" />Manage Scheduled Rides</h2>
      <EditScheduledRideModal
        open={editModal.open}
        ride={editModal.ride}
        onClose={() => setEditModal({ open: false, ride: null })}
        onSave={updatedRide => {
          setRides(rides => rides.map(r => r._id === updatedRide._id ? updatedRide : r));
        }}
      />
      {loading ? (
        <div className="text-center py-12 text-base font-medium">Loading...</div>
      ) : rides.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-base">No scheduled rides found.</div>
      ) : (
        <div className="flex flex-col gap-6">
          {rides.map(ride => {
            const status = ride.status || 'scheduled';
            const statusClass = statusColors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
            return (
              <Card key={ride._id} className="border rounded-xl shadow-sm hover:shadow-md transition-all bg-card px-0">
                <CardContent className="p-7 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap gap-6">
                        <div>
                          <div className="text-xs text-muted-foreground font-medium mb-1">Pickup Location</div>
                          <div className="font-semibold text-base flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-green-600 min-w-[20px] min-h-[20px]" />
                            {ride.pickup}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-medium mb-1">Drop-off Location</div>
                          <div className="font-semibold text-base flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-red-600 min-w-[16px] min-h-[16px]" />
                            {ride.destination}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-6 mt-2">
                        <div>
                          <div className="text-xs text-muted-foreground font-medium mb-1">Date</div>
                          <div className="flex items-center gap-2 font-medium"><Calendar className="h-4 w-4 text-primary" />{ride.scheduleStartDate ? new Date(ride.scheduleStartDate).toLocaleDateString() : '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-medium mb-1">Time</div>
                          <div className="flex items-center gap-2 font-medium"><Clock className="h-4 w-4 text-primary" />{ride.scheduleStartDate ? new Date(ride.scheduleStartDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-medium mb-1">Schedule Period</div>
                          <div className="flex items-center gap-2 font-medium"><BadgeCheck className="h-4 w-4 text-primary" />{periodLabels[ride.schedulePeriod] || ride.schedulePeriod}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[160px] md:items-end md:justify-center mt-4 md:mt-0">
                      <div>
                        <div className="text-xs text-muted-foreground font-medium mb-1">Vehicle Type</div>
                        <div className="font-semibold text-base text-primary">{vehicleLabels[ride.vehicleType] || ride.vehicleType}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-medium mb-1">Fare</div>
                        <div className="font-bold text-lg text-primary">₹{ride.fare}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-medium mb-1">Status</div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusClass}`}>{status}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button size="icon" variant="ghost" title="Edit" className="hover:bg-primary/10" onClick={() => setEditModal({ open: true, ride })}>
                          <Edit className="h-5 w-5 text-primary" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
