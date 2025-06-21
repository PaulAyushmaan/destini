import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DriverSettings() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Driver Settings</h1>

      {/* Profile Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your driver profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter your full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="Enter your phone number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">Driver's License Number</Label>
              <Input id="license" placeholder="Enter your license number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle Registration Number</Label>
              <Input id="vehicle" placeholder="Enter your vehicle registration number" />
            </div>
            <Button>Save Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
          <CardDescription>Update your vehicle details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Vehicle Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="auto">Auto/Toto</SelectItem>
                  <SelectItem value="bike">Bike</SelectItem>
                  <SelectItem value="shuttle">Shuttle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Vehicle Model</Label>
              <Input id="model" placeholder="Enter vehicle model" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Vehicle Year</Label>
              <Input id="year" type="number" placeholder="Enter vehicle year" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Vehicle Color</Label>
              <Input id="color" placeholder="Enter vehicle color" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Preferences */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Service Preferences</CardTitle>
          <CardDescription>Configure your service preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>College Services</Label>
                <p className="text-sm text-muted-foreground">Accept rides from college students</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Regular Services</Label>
                <p className="text-sm text-muted-foreground">Accept regular user rides</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Shuttle Services</Label>
                <p className="text-sm text-muted-foreground">Accept shuttle route rides</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Fare Bargaining</Label>
                <p className="text-sm text-muted-foreground">Allow fare bargaining with users</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Availability Settings</CardTitle>
          <CardDescription>Set your working hours and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Working Hours</Label>
              <div className="flex gap-2">
                <Input type="time" />
                <span className="flex items-center">to</span>
                <Input type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Preferred Areas</Label>
              <Input placeholder="Enter preferred areas (comma separated)" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Accept Rides</Label>
                <p className="text-sm text-muted-foreground">Automatically accept ride requests</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
          <CardDescription>Configure your payment preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">Account Number</Label>
              <Input id="account" placeholder="Enter account number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifsc">IFSC Code</Label>
              <Input id="ifsc" placeholder="Enter IFSC code" />
            </div>
            <Button>Save Payment Details</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 