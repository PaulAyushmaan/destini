import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ServiceManagement() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Service Management</h1>

      {/* Cab Services */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cab Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Cab Services</Label>
                <p className="text-sm text-muted-foreground">Allow students to book cabs</p>
              </div>
              <Switch />
            </div>
            <div className="space-y-2">
              <Label>Service Areas</Label>
              <Input placeholder="Enter service areas (comma separated)" />
            </div>
            <div className="space-y-2">
              <Label>Discount Rate</Label>
              <Input type="number" placeholder="Enter discount percentage" />
            </div>
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Shuttle Services */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Shuttle Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Shuttle Services</Label>
                <p className="text-sm text-muted-foreground">Allow students to book shuttles</p>
              </div>
              <Switch />
            </div>
            <div className="space-y-2">
              <Label>Add New Route</Label>
              <div className="flex gap-2">
                <Input placeholder="Route Name" />
                <Input placeholder="Start Location" />
                <Input placeholder="End Location" />
                <Input type="time" />
                <Button variant="outline">Add Route</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Active Routes</Label>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Route</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Start</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">End</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Time</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">Route A</td>
                      <td className="p-4">Campus</td>
                      <td className="p-4">Station</td>
                      <td className="p-4">8:00 AM</td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campus Rentals */}
      <Card>
        <CardHeader>
          <CardTitle>Campus Rentals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Campus Rentals</Label>
                <p className="text-sm text-muted-foreground">Allow students to rent bicycles and e-bikes</p>
              </div>
              <Switch />
            </div>
            <div className="space-y-2">
              <Label>Add New Vehicle</Label>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bicycle">Bicycle</SelectItem>
                    <SelectItem value="ebike">E-Bike</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Vehicle ID" />
                <Input placeholder="Hourly Rate" />
                <Button variant="outline">Add Vehicle</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Available Vehicles</Label>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Rate</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">Bicycle</td>
                      <td className="p-4">BIKE-001</td>
                      <td className="p-4">₹20/hr</td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                          Available
                        </span>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 