import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Wallet, Building2, Receipt } from "lucide-react"

export default function UserPayments() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Payments</h1>

      {/* Payment Methods */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <div>
                  <div className="font-medium">Credit Card</div>
                  <div className="text-sm text-muted-foreground">**** **** **** 1234</div>
                </div>
              </div>
              <Button variant="ghost" size="sm">Remove</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <div>
                  <div className="font-medium">Wallet</div>
                  <div className="text-sm text-muted-foreground">Balance: ₹500</div>
                </div>
              </div>
              <Button variant="ghost" size="sm">Remove</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <div>
                  <div className="font-medium">Bank Account</div>
                  <div className="text-sm text-muted-foreground">**** **** 5678</div>
                </div>
              </div>
              <Button variant="ghost" size="sm">Remove</Button>
            </div>
            <Button variant="outline" className="w-full">Add Payment Method</Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="rides">Rides</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                  <SelectItem value="refunds">Refunds</SelectItem>
                </SelectContent>
              </Select>
              <Input type="month" className="w-40" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Method</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">Mar 25, 2024</td>
                    <td className="p-4">Cab Ride</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Card</span>
                      </div>
                    </td>
                    <td className="p-4 text-red-600">-₹150</td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Mar 24, 2024</td>
                    <td className="p-4">Wallet Recharge</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>Bank</span>
                      </div>
                    </td>
                    <td className="p-4 text-green-600">+₹500</td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Mar 23, 2024</td>
                    <td className="p-4">Shuttle Ride</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        <span>Wallet</span>
                      </div>
                    </td>
                    <td className="p-4 text-red-600">-₹50</td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing 1 to 3 of 3 entries
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 