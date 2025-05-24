import { Button } from "@/components/ui/button"
import { Car, Users, MapPin, Wallet, ArrowUp, ArrowDown, Bus, Bike } from "lucide-react"
import LogoutButton from '@/components/LogoutButton'

export default function Dashboard() {
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
        <div className="rounded-xl border bg-card">
          <div className="border-b p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Bus className="h-5 w-5 text-primary" />
              </div>
              <h4 className="text-xl font-semibold">Campus Shuttle</h4>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Routes</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">On-duty Drivers</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Today's Rides</span>
                <span className="font-medium">145</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-6">View Details</Button>
          </div>
        </div>

        {/* Cab Service */}
        <div className="rounded-xl border bg-card">
          <div className="border-b p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <h4 className="text-xl font-semibold">Cab Service</h4>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Available Cars</span>
                <span className="font-medium">25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Drivers</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Today's Rides</span>
                <span className="font-medium">89</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-6">View Details</Button>
          </div>
        </div>

        {/* Bike Rentals */}
        <div className="rounded-xl border bg-card">
          <div className="border-b p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Bike className="h-5 w-5 text-primary" />
              </div>
              <h4 className="text-xl font-semibold">Bike Rentals</h4>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Bikes</span>
                <span className="font-medium">120</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Available Now</span>
                <span className="font-medium">85</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Today's Rentals</span>
                <span className="font-medium">34</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-6">View Details</Button>
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