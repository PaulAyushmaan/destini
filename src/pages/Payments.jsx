import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Payments() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Payments</h1>
      
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Ride Payment</p>
                  <p className="text-sm text-muted-foreground">March 25, 2025</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">-$12.50</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 