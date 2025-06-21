import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bike, MapPin, Clock, Users, ArrowLeft, Wallet, TrendingUp } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

export default function BikeRental() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('today')

  // Mock metrics based on time range
  const metrics = {
    today: [
      { label: 'Total Bikes', value: '120', change: '+5', icon: Bike },
      { label: 'Available Now', value: '85', change: '-2', icon: Bike },
      { label: "Today's Revenue", value: '₹3,450', change: '+15%', icon: Wallet },
      { label: 'Active Users', value: '35', change: '+8', icon: Users },
    ],
    week: [
      { label: 'Total Bikes', value: '125', change: '+10', icon: Bike },
      { label: 'Available Now', value: '90', change: '+5', icon: Bike },
      { label: "Total Revenue", value: '₹24,850', change: '+18%', icon: Wallet },
      { label: 'Active Users', value: '250', change: '+12%', icon: Users },
    ],
    month: [
      { label: 'Total Bikes', value: '130', change: '+15', icon: Bike },
      { label: 'Available Now', value: '95', change: '+10', icon: Bike },
      { label: "Total Revenue", value: '₹98,450', change: '+25%', icon: Wallet },
      { label: 'Active Users', value: '850', change: '+20%', icon: Users },
    ],
  }

  const rentalLocations = [
    {
      id: 1,
      name: "Main Gate Station",
      available: 25,
      total: 30,
      status: "High Availability",
      popularTimes: "8 AM - 10 AM",
      avgRentalTime: "2.5 hrs"
    },
    {
      id: 2,
      name: "Library Complex",
      available: 15,
      total: 25,
      status: "Medium Availability",
      popularTimes: "12 PM - 2 PM",
      avgRentalTime: "1.5 hrs"
    },
    {
      id: 3,
      name: "Student Center",
      available: 5,
      total: 20,
      status: "Low Availability",
      popularTimes: "4 PM - 6 PM",
      avgRentalTime: "3 hrs"
    },
    {
      id: 4,
      name: "Sports Complex",
      available: 20,
      total: 25,
      status: "High Availability",
      popularTimes: "5 PM - 7 PM",
      avgRentalTime: "2 hrs"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/college')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Bike Rental Service</h2>
            <p className="text-muted-foreground">
              Monitor and manage your campus bike rental service
            </p>
          </div>
        </div>
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics[timeRange].map((metric, index) => (
          <Card key={index} className="hover-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                <metric.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{metric.value}</span>
                <span className={cn(
                  "text-sm flex items-center gap-1",
                  metric.change.startsWith('+') ? "text-green-600" : 
                  metric.change.startsWith('-') ? "text-red-600" : 
                  "text-yellow-600"
                )}>
                  {metric.change}
                  <TrendingUp className="h-3 w-3" />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rental Locations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Rental Locations</CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              View All Locations
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rentalLocations.map((location) => (
              <div key={location.id} className="flex items-center justify-between p-4 border rounded-lg hover-card">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Bike className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{location.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        ({location.available} of {location.total} available)
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Peak: {location.popularTimes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Avg. Rental: {location.avgRentalTime}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={cn(
                      "text-sm font-medium",
                      location.available > location.total * 0.6 ? "text-green-600" : 
                      location.available > location.total * 0.3 ? "text-yellow-600" : 
                      "text-red-600"
                    )}>
                      {location.status}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2 hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    Manage
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 