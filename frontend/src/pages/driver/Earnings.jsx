import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, TrendingUp, Calendar, CreditCard } from "lucide-react"

export default function DriverEarnings() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Earnings</h1>

      {/* Earnings Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,250</div>
            <p className="text-xs text-muted-foreground">+₹450 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8,750</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹35,000</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,25,000</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Breakdown */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Earnings Breakdown</CardTitle>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="This Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Service</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Rides</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Distance</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Earnings</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Commission</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Net Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">Mar 25, 2024</td>
                    <td className="p-4">Cab</td>
                    <td className="p-4">8</td>
                    <td className="p-4">120 km</td>
                    <td className="p-4">₹1,200</td>
                    <td className="p-4">₹120</td>
                    <td className="p-4">₹1,080</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Mar 24, 2024</td>
                    <td className="p-4">Shuttle</td>
                    <td className="p-4">12</td>
                    <td className="p-4">180 km</td>
                    <td className="p-4">₹900</td>
                    <td className="p-4">₹90</td>
                    <td className="p-4">₹810</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing 1 to 2 of 2 entries
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Available Balance</div>
                <div className="text-sm text-muted-foreground">Ready to withdraw</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">₹12,500</div>
                <Button>Withdraw</Button>
              </div>
            </div>
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
              <Label>Account Details</Label>
              <Input placeholder="Enter account number" />
              <Input placeholder="Enter IFSC code" />
            </div>
            <Button className="w-full">Save Payment Details</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 