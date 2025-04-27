import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserSettings() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Profile Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
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
              <Label htmlFor="collegeId">College ID (if applicable)</Label>
              <Input id="collegeId" placeholder="Enter your college ID" />
            </div>
            <Button>Save Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Ride Preferences */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ride Preferences</CardTitle>
          <CardDescription>Configure your ride booking preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Preferred Payment Method</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Split Fare</Label>
                <p className="text-sm text-muted-foreground">Automatically split fare with friends</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ride Sharing</Label>
                <p className="text-sm text-muted-foreground">Enable ride sharing for better rates</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Bargaining</Label>
                <p className="text-sm text-muted-foreground">Allow fare bargaining with drivers</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campus Services (for students) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Campus Services</CardTitle>
          <CardDescription>Manage your campus-specific services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Campus Rentals</Label>
                <p className="text-sm text-muted-foreground">Enable bicycle and e-bike rentals</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Shuttle Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about shuttle availability</p>
              </div>
              <Switch />
            </div>
            <div className="space-y-2">
              <Label>Preferred Shuttle Routes</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred routes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="route1">Route A</SelectItem>
                  <SelectItem value="route2">Route B</SelectItem>
                  <SelectItem value="route3">Route C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ride Updates</Label>
                <p className="text-sm text-muted-foreground">Get updates about your rides</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Promotional Offers</Label>
                <p className="text-sm text-muted-foreground">Receive promotional notifications</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Service Updates</Label>
                <p className="text-sm text-muted-foreground">Get updates about new services</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 