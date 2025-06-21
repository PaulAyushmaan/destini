import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, MapPin, Clock, Users, ArrowLeft, Wallet, TrendingUp } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

export default function CabService() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('today')

  // Mock metrics based on time range
  const metrics = {
    today: [
      { label: 'Available Cars', value: '25', change: '+2', icon: Car },
      { label: 'Active Drivers', value: '18', change: '+3', icon: Users },
      { label: 'Total Revenue', value: '₹12,450', change: '+8%', icon: Wallet },
      { label: 'Avg. Wait Time', value: '5 min', change: '-2min', icon: Clock },
    ],
    week: [
      { label: 'Available Cars', value: '28', change: '+5', icon: Car },
      { label: 'Active Drivers', value: '22', change: '+4', icon: Users },
      { label: 'Total Revenue', value: '₹85,450', change: '+12%', icon: Wallet },
      { label: 'Avg. Wait Time', value: '6 min', change: '-1min', icon: Clock },
    ],
    month: [
      { label: 'Available Cars', value: '30', change: '+8', icon: Car },
      { label: 'Active Drivers', value: '25', change: '+7', icon: Users },
      { label: 'Total Revenue', value: '₹3,24,450', change: '+15%', icon: Wallet },
      { label: 'Avg. Wait Time', value: '4 min', change: '-3min', icon: Clock },
    ],
  }

  const activeRides = [
    {
      id: 1,
      driver: "John Doe",
      pickup: "Main Gate",
      dropoff: "Girls Hostel",
      status: "In Progress",
      eta: "5 min",
      rating: 4.8
    },
    {
      id: 2,
      driver: "Jane Smith",
      pickup: "Boys Hostel",
      dropoff: "Library",
      status: "Picking Up",
      eta: "2 min",
      rating: 4.9
    },
    {
      id: 3,
      driver: "Mike Johnson",
      pickup: "Sports Complex",
      dropoff: "Main Gate",
      status: "In Progress",
      eta: "8 min",
      rating: 4.7
    }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/college')}
            className="gap-2 hover:bg-primary/10 hover:text-primary transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Cab Service</h2>
            <p className="text-muted-foreground">
              Monitor and manage your on-demand cab service
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

      {/* Active Rides */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Rides</CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              View All
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeRides.map((ride) => (
              <div 
                key={ride.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover-card bg-card/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{ride.driver}</h4>
                      <span className="text-sm text-muted-foreground">
                        ★ {ride.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {ride.pickup} → {ride.dropoff}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">ETA: {ride.eta}</p>
                    <p className={cn(
                      "text-sm",
                      ride.status === "In Progress" ? "text-primary" : "text-yellow-600"
                    )}>
                      {ride.status}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2 hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    Track
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