import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function CollegeSettings() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">College Settings</h1>
      
      {/* College Profile Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>College Profile</CardTitle>
          <CardDescription>Update your college's basic information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collegeName">College Name</Label>
              <Input id="collegeName" placeholder="Enter college name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Enter college address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input id="contact" type="tel" placeholder="Enter contact number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter college email" />
            </div>
            <Button>Save Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Service Settings</CardTitle>
          <CardDescription>Configure available services for your students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cab Services</Label>
                <p className="text-sm text-muted-foreground">Enable cab booking for students</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Shuttle Services</Label>
                <p className="text-sm text-muted-foreground">Enable shuttle routes for students</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto/Toto Services</Label>
                <p className="text-sm text-muted-foreground">Enable auto/toto booking for students</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Campus Rentals</Label>
                <p className="text-sm text-muted-foreground">Enable bicycle and e-bike rentals</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Management */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
          <CardDescription>Manage student access and IDs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Bulk Import</Label>
              <div className="flex gap-2">
                <Input type="file" accept=".csv,.xlsx" />
                <Button variant="outline">Import</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Manual Entry</Label>
              <div className="flex gap-2">
                <Input placeholder="Enter student email" />
                <Input placeholder="Enter student name" />
                <Button variant="outline">Add Student</Button>
              </div>
            </div>
            <Button>Generate Access IDs</Button>
          </div>
        </CardContent>
      </Card>

      {/* Marketing Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Settings</CardTitle>
          <CardDescription>Configure marketing preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cab Advertising</Label>
                <p className="text-sm text-muted-foreground">Show college ads in cabs</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Shuttle Advertising</Label>
                <p className="text-sm text-muted-foreground">Show college ads in shuttles</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Digital Marketing</Label>
                <p className="text-sm text-muted-foreground">Include in digital campaigns</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 