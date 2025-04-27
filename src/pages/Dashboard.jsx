import { useState } from "react"
import { Link } from "react-router-dom"
import { Car, Clock, CreditCard, MapPin, Plus, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  const [rideType, setRideType] = useState("individual")

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$250.00</div>
            <p className="text-xs text-muted-foreground">+$50.00 from last month</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Add Funds
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
          <CardFooter>
            <Link to="/dashboard/rides">
              <Button variant="outline" size="sm">
                View History
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Rides</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Next ride in 2 hours</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View Schedule
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Book a Ride</h2>
        <Tabs defaultValue={rideType} className="w-full" onValueChange={setRideType}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">Individual Ride</TabsTrigger>
            <TabsTrigger value="shared">Shared Ride</TabsTrigger>
          </TabsList>
          <TabsContent value="individual">
            <Card>
              <CardHeader>
                <CardTitle>Book an Individual Ride</CardTitle>
                <CardDescription>Book a private ride just for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup">Pickup Location</Label>
                  <div className="flex gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <Input id="pickup" placeholder="Enter pickup location" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <div className="flex gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <Input id="destination" placeholder="Enter destination" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Pickup Time</Label>
                  <div className="flex gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <Input id="time" type="datetime-local" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  <RadioGroup defaultValue="standard">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard">Standard</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="premium" id="premium" />
                      <Label htmlFor="premium">Premium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="shuttle" id="shuttle" />
                      <Label htmlFor="shuttle">Shuttle</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Book Now</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="shared">
            <Card>
              <CardHeader>
                <CardTitle>Book a Shared Ride</CardTitle>
                <CardDescription>Share your ride with friends and split the fare</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shared-pickup">Pickup Location</Label>
                  <div className="flex gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <Input id="shared-pickup" placeholder="Enter pickup location" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shared-destination">Destination</Label>
                  <div className="flex gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <Input id="shared-destination" placeholder="Enter destination" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shared-time">Pickup Time</Label>
                  <div className="flex gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <Input id="shared-time" type="datetime-local" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Friends to Share With</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <Input placeholder="Friend's email or phone" />
                      <Button variant="ghost" size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Friend
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  <RadioGroup defaultValue="standard">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="shared-standard" />
                      <Label htmlFor="shared-standard">Standard</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="premium" id="shared-premium" />
                      <Label htmlFor="shared-premium">Premium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="shuttle" id="shared-shuttle" />
                      <Label htmlFor="shared-shuttle">Shuttle</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Book Shared Ride</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Rides</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Campus to Downtown</CardTitle>
              <CardDescription>March 25, 2025 • 3:30 PM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Standard • 4.2 miles</p>
                  <p className="text-sm text-muted-foreground">Driver: John D.</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">$12.50</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Library to Residence Hall</CardTitle>
              <CardDescription>March 23, 2025 • 7:15 PM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Shuttle • 1.8 miles</p>
                  <p className="text-sm text-muted-foreground">Driver: Sarah M.</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">$5.75</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Mall to Campus</CardTitle>
              <CardDescription>March 20, 2025 • 2:45 PM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Shared • 3.5 miles</p>
                  <p className="text-sm text-muted-foreground">Driver: Michael T.</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">$8.25</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 text-center">
          <Link to="/dashboard/rides">
            <Button variant="outline">View All Rides</Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 