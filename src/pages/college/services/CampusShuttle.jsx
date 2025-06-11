import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bus, MapPin, Clock, Users, ArrowLeft, TrendingUp, Route } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

export default function CampusShuttle() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('today')

  // Mock metrics based on time range
  const metrics = {
    today: [
      { label: 'Active Routes', value: '8', change: '+1', icon: Route },
      { label: 'Active Shuttles', value: '12', change: '+2', icon: Bus },
      { label: 'Total Passengers', value: '450', change: '+45', icon: Users },
      { label: 'Avg. Wait Time', value: '8 min', change: '-1min', icon: Clock },
    ],
    week: [
      { label: 'Active Routes', value: '10', change: '+2', icon: Route },
      { label: 'Active Shuttles', value: '15', change: '+3', icon: Bus },
      { label: 'Total Passengers', value: '3,250', change: '+12%', icon: Users },
      { label: 'Avg. Wait Time', value: '7 min', change: '-2min', icon: Clock },
    ],
    month: [
      { label: 'Active Routes', value: '12', change: '+4', icon: Route },
      { label: 'Active Shuttles', value: '18', change: '+6', icon: Bus },
      { label: 'Total Passengers', value: '12,450', change: '+15%', icon: Users },
      { label: 'Avg. Wait Time', value: '6 min', change: '-3min', icon: Clock },
    ],
  }

  const shuttleRoutes = [
    {
      id: 1,
      name: "Main Campus Loop",
      stops: 5,
      nextArrival: "3 min",
      status: "On Time",
      capacity: "75%",
      currentStop: "Library"
    },
    {
      id: 2,
      name: "Library Express",
      stops: 3,
      nextArrival: "7 min",
      status: "Delayed",
      capacity: "90%",
      currentStop: "Main Gate"
    },
    {
      id: 3,
      name: "Residence Hall Route",
      stops: 4,
      nextArrival: "2 min",
      status: "On Time",
      capacity: "60%",
      currentStop: "Sports Complex"
    },
    {
      id: 4,
      name: "Sports Complex Shuttle",
      stops: 3,
      nextArrival: "10 min",
      status: "On Time",
      capacity: "45%",
      currentStop: "Cafeteria"
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
            <h2 className="text-3xl font-bold tracking-tight">Campus Shuttle</h2>
            <p className="text-muted-foreground">
              Monitor and manage your campus shuttle service
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

      {/* Active Routes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Routes</CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              View All Routes
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shuttleRoutes.map((route) => (
              <div key={route.id} className="flex items-center justify-between p-4 border rounded-lg hover-card">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Bus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{route.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        ({route.stops} stops)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      Current Stop: {route.currentStop}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Next: {route.nextArrival}</p>
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        "text-sm",
                        route.status === "On Time" ? "text-green-600" : "text-yellow-600"
                      )}>
                        {route.status}
                      </p>
                      <span className="text-sm text-muted-foreground">
                        • {route.capacity} full
                      </span>
                    </div>
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