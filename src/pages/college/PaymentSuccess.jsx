import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [status, setStatus] = useState("loading")
  const [error, setError] = useState(null)

  useEffect(() => {
    const paymentLinkId = searchParams.get('razorpay_payment_link_id')
    if (!paymentLinkId) {
      setError("Missing payment link ID")
      setStatus("error")
      return
    }

    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error("Authentication token not found")
        }

        // First, check payment status
        console.log('Fetching payment status...');
        const res = await fetch(`${API_URL}/payments/status/${paymentLinkId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          credentials: 'include'
        })
        if (!res.ok) {
          throw new Error("Failed to fetch payment status")
        }
        const data = await res.json()
        console.log('Payment status:', data);
        setStatus(data.status)

        if (data.status === "paid") {
          // If payment is successful, fetch latest user data
          console.log('Payment successful, fetching updated user data...');
          const userRes = await fetch(`${API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            },
            credentials: 'include'
          });
          
          if (!userRes.ok) {
            console.error('Failed to fetch user data');
            throw new Error("Failed to update user data");
          }

          const userData = await userRes.json();
          console.log('Received updated user data:', userData);
          
          // Update localStorage with new user data
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('Updated localStorage with new user data');

          toast({
            title: "Payment Successful",
            description: "Your services have been activated",
            variant: "success"
          })
          
          // Navigate to dashboard after a short delay
          setTimeout(() => navigate('/college'), 2000)
        } else if (data.status === "created") {
          setError("Payment not completed")
        } else {
          setError("Payment failed or unknown status")
        }
      } catch (err) {
        console.error('Error in payment verification:', err);
        setError(err.message)
        setStatus("error")
        toast({
          title: "Payment Error",
          description: err.message,
          variant: "destructive"
        })
      }
    }

    fetchStatus()
  }, [searchParams, toast, navigate])

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Payment {status === "paid" ? "Successful" : status === "loading" ? "Processing" : "Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              {status === "paid" ? (
                <CheckCircle2 className="h-16 w-16 text-primary" />
              ) : (
                <XCircle className="h-16 w-16 text-destructive" />
              )}
            </div>
            {status === "loading" ? (
              <p className="text-center text-muted-foreground">Verifying payment...</p>
            ) : status === "paid" ? (
              <p className="text-center text-muted-foreground">
                Thank you for your payment. Your services have been activated.
              </p>
            ) : (
              <>
                <p className="text-center text-destructive">{error || "Payment failed"}</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/college/select-services')}
                >
                  Try Again
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 