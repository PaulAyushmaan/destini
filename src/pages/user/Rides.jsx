import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Bus, Bike, MapPin, Clock, Star } from "lucide-react"

export default function UserRides() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">My Rides</h1>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Rides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="cab">Cab</SelectItem>
                  <SelectItem value="shuttle">Shuttle</SelectItem>
                  <SelectItem value="bike">Bike</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="flex gap-2">
                <Input type="date" />
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button>Apply Filters</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ride History */}
      <div className="space-y-4">
        {/* Completed Ride */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span className="font-medium">Cab Ride</span>
                </div>
                <div className="text-sm text-muted-foreground">Mar 25, 2024</div>
              </div>
              <div className="text-right">
                <div className="font-medium">₹150</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                <span>Campus</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>Station</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>8:30 AM</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">4.5</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm">View Details</Button>
              <Button variant="outline" size="sm">Book Again</Button>
            </div>
          </CardContent>
        </Card>

        {/* In Progress Ride */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Bus className="h-4 w-4" />
                  <span className="font-medium">Shuttle Ride</span>
                </div>
                <div className="text-sm text-muted-foreground">Mar 24, 2024</div>
              </div>
              <div className="text-right">
                <div className="font-medium">₹50</div>
                <div className="text-sm text-yellow-600">In Progress</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                <span>Station</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>Campus</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>9:00 AM</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm">View Details</Button>
              <Button variant="outline" size="sm">Cancel Ride</Button>
            </div>
          </CardContent>
        </Card>

        {/* Cancelled Ride */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Bike className="h-4 w-4" />
                  <span className="font-medium">Bike Rental</span>
                </div>
                <div className="text-sm text-muted-foreground">Mar 23, 2024</div>
              </div>
              <div className="text-right">
                <div className="font-medium">₹100</div>
                <div className="text-sm text-red-600">Cancelled</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                <span>Campus</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>2 hours</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm">View Details</Button>
              <Button variant="outline" size="sm">Book Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 