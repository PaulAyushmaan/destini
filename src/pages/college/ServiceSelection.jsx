import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Car, Bus, Bike, CreditCard } from "lucide-react"

export default function ServiceSelection() {
  const [selectedServices, setSelectedServices] = useState({
    cab: false,
    shuttle: false,
    rental: false
  })

  const services = [
    {
      id: "cab",
      name: "Cab Service",
      description: "On-demand cab service for students",
      price: 9999,
      icon: Car
    },
    {
      id: "shuttle",
      name: "Shuttle Service",
      description: "Regular shuttle routes for campus transport",
      price: 19999,
      icon: Bus
    },
    {
      id: "rental",
      name: "Campus Rentals",
      description: "Bike and vehicle rentals for students",
      price: 4999,
      icon: Bike
    },
    {
      id: "Complementary",
      name: "Complementary Marketing",
      description: "Absolutely Free Marketing services for your college",
      price: 0.00,
      icon: Bus
    }
  ]

  const calculateTotal = () => {
    return services.reduce((total, service) => {
      return total + (selectedServices[service.id] ? service.price : 0)
    }, 0)
  }

  const handlePayment = () => {
    // TODO: Integrate payment gateway
    console.log("Processing payment for:", selectedServices)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Select Services</h1>
        <p className="text-muted-foreground mb-8">
          Choose the services you want to enable for your college. You can manage these services after payment.
        </p>

        <div className="grid gap-6 mb-8">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Card key={service.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <p className="font-semibold">₹{service.price.toLocaleString()}/year</p>
                    <div className="flex items-center gap-2">
                      <Switch
                        id={service.id}
                        checked={selectedServices[service.id]}
                        onCheckedChange={(checked) =>
                          setSelectedServices((prev) => ({ ...prev, [service.id]: checked }))
                        }
                      />
                      <Label htmlFor={service.id}>Enable</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {services.map((service) => (
              selectedServices[service.id] && (
                <div key={service.id} className="flex justify-between">
                  <span>{service.name}</span>
                  <span>₹{service.price.toLocaleString()}</span>
                </div>
              )
            ))}
            <div className="border-t pt-4 flex justify-between font-bold">
              <span>Total Amount</span>
              <span>₹{calculateTotal().toLocaleString()}</span>
            </div>
            <Button
              className="w-full mt-4"
              size="lg"
              disabled={!Object.values(selectedServices).some(Boolean)}
              onClick={handlePayment}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Proceed to Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 