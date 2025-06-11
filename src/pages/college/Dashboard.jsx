import { Button } from "@/components/ui/button"
import { Car, Users, MapPin, Wallet, ArrowUp, ArrowDown, Bus, Bike, ArrowRight } from "lucide-react"
import LogoutButton from '@/components/LogoutButton'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6">
      {/* Header Actions */}
      <div className="flex justify-end items-center mb-4">
        <LogoutButton />
      </div>
      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">Total Students</p>
            <h3 className="text-2xl font-bold">1,250</h3>
            <p className="text-sm text-green-500 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              15% from last month
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">Active Rides</p>
            <h3 className="text-2xl font-bold">23</h3>
            <p className="text-sm text-muted-foreground">Current ongoing rides</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
            <h3 className="text-2xl font-bold">$12,450</h3>
            <p className="text-sm text-green-500 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              8% from last month
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">Total Vehicles</p>
            <h3 className="text-2xl font-bold">45</h3>
            <p className="text-sm text-muted-foreground">Across all services</p>
          </div>
        </div>
      </div>

      {/* Service Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Campus Shuttle */}
        <div className="rounded-xl border bg-card hover-card">
          <div className="border-b p-6 bg-primary/5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Bus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-semibold">Campus Shuttle</h4>
                <p className="text-sm text-muted-foreground">Real-time tracking</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm font-medium">Active Routes</span>
                <span className="font-semibold text-primary">8</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm font-medium">On-duty Drivers</span>
                <span className="font-semibold text-primary">12</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm font-medium">Today's Rides</span>
                <span className="font-semibold text-primary">145</span>
              </div>
            </div>
            <Button 
              variant="default" 
              className="w-full mt-6 gap-2"
              onClick={() => navigate('/college/services/shuttle')}
            >
              View Details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Cab Service */}
        <div className="rounded-xl border bg-card hover-card">
          <div className="border-b p-6 bg-primary/5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-semibold">Cab Service</h4>
                <p className="text-sm text-muted-foreground">On-demand rides</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm font-medium">Available Cars</span>
                <span className="font-semibold text-primary">25</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm font-medium">Active Drivers</span>
                <span className="font-semibold text-primary">18</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm font-medium">Today's Rides</span>
                <span className="font-semibold text-primary">89</span>
              </div>
            </div>
            <Button 
              variant="default" 
              className="w-full mt-6 gap-2"
              onClick={() => navigate('/college/services/cab')}
            >
              View Details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bike Rentals */}
        <div className="rounded-xl border bg-card hover-card">
          <div className="border-b p-6 bg-primary/5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Bike className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-semibold">Bike Rentals</h4>
                <p className="text-sm text-muted-foreground">Easy rentals</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm font-medium">Total Bikes</span>
                <span className="font-semibold text-primary">120</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm font-medium">Available Now</span>
                <span className="font-semibold text-primary">85</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm font-medium">Today's Rentals</span>
                <span className="font-semibold text-primary">34</span>
              </div>
            </div>
            <Button 
              variant="default" 
              className="w-full mt-6 gap-2"
              onClick={() => navigate('/college/services/bike')}
            >
              View Details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
                {/* Complimentary Marketing Insights */}
                <div className="rounded-xl border bg-card hover-card">
          <div className="border-b p-6 bg-primary/5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Bike className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-semibold">Complimentary Marketing Insights</h4>
                <p className="text-sm text-muted-foreground">Get insights on your marketing efforts</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm font-medium">Total Insights</span>
                <span className="font-semibold text-primary">10</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm font-medium">High Performing Campaigns</span>
                <span className="font-semibold text-primary">5</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm font-medium">New Students</span>
                <span className="font-semibold text-primary">34</span>
              </div>
            </div>
            <Button 
              variant="default" 
              className="w-full mt-6 gap-2"
              onClick={() => navigate('/college/marketing-insights')}
            >
              View Details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-card">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">New Student Registration</h4>
                <p className="text-sm text-muted-foreground">John Doe registered as a new student</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Bus className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Shuttle Route Update</h4>
                <p className="text-sm text-muted-foreground">Route #3 schedule modified</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">New Ride Request</h4>
                <p className="text-sm text-muted-foreground">5 students requested campus shuttle</p>
                <p className="text-xs text-muted-foreground">30 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 