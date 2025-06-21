import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Car, Bus, Bike, CreditCard } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';

export default function ServiceSelection() {
  const [selectedServices, setSelectedServices] = useState({
    cab: false,
    shuttle: false,
    rental: false
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const services = [
    {
      id: "cab",
      name: "Cab Service",
      description: "On-demand cab service for students",
      price: 99,
      icon: Car
    },
    {
      id: "shuttle",
      name: "Shuttle Service",
      description: "Regular shuttle routes for campus transport",
      price: 15,
      icon: Bus
    },
    {
      id: "rental",
      name: "Campus Rentals",
      description: "Bike and vehicle rentals for students",
      price: 20,
      icon: Bike
    }
  ]

  const calculateTotal = () => {
    return services.reduce((total, service) => {
      return total + (selectedServices[service.id] ? service.price : 0)
    }, 0)
  }

  const handlePayment = async () => {
    try {
      setLoading(true)
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Get selected services array
      const selectedServiceIds = Object.entries(selectedServices)
        .filter(([_, selected]) => selected)
        .map(([id]) => id)
        .filter(id => ['cab', 'shuttle', 'rental'].includes(id)); // Only allow valid services

      if (selectedServiceIds.length === 0) {
        throw new Error('Please select at least one service');
      }

      // Create payment link
      const response = await fetch(`${API_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: calculateTotal(),
          services: selectedServiceIds
        })
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment link');
      }

      const { paymentLink } = await response.json()
      if (!paymentLink) {
        throw new Error('Invalid payment link received');
      }

      // Redirect to Razorpay payment link
      window.location.href = paymentLink;
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Payment Failed",
        description: error.message || "Please try again later",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
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
              disabled={!Object.values(selectedServices).some(Boolean) || loading}
              onClick={handlePayment}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {loading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 