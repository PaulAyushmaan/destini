import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bus, Car, Bike } from "lucide-react"
import { Link } from "react-router-dom"

export default function Services() {
  const services = [
    {
      name: "Cab Service",
      description: "On-demand cab service for students",
      icon: Car,
      activeUsers: 150,
      status: "Active",
      key:"cab"
    },
    {
      name: "Shuttle Service",
      description: "Regular shuttle routes for campus transport",
      icon: Bus,
      activeUsers: 300,
      status: "Active",
      key:"shuttle"
    },
    {
      name: "Bike Rentals",
      description: "Bike and vehicle rentals for students",
      icon: Bike,
      activeUsers: 75,
      status: "Active",
      key:"bike"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = service.icon
          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  <div className="flex justify-between text-sm">
                    <span>Active Users</span>
                    <span className="font-medium">{service.activeUsers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status</span>
                    <span className="font-medium text-green-600">{service.status}</span>
                  </div>
                  <Link to={`/college/services/${service.key}`}>
                    <Button className="w-full" variant="outline">
                    Manage Service
                  </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 