import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Rides() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Rides</h1>
      
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
      </div>
    </div>
  )
} 