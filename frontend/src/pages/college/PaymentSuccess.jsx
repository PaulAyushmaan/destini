import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle,Loader } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';

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
        console.log(localStorage.getItem('user')?.token);
        // Get token from localStorage (try to recover if missing)
        let token = localStorage.getItem('token');
        if (!token) {
          // Try to recover from user object if possible
          const userStr = localStorage.getItem('user');
          if (userStr) {
            try {
              const userObj = JSON.parse(userStr);
              if (userObj.token){ 
                token = userObj.token;
              localStorage.setItem('token', userObj.token);
            }
            } catch {}
          }
        }
        if (!token) {
          setError("Authentication token not found");
          setStatus("error");
          return;
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
          // Only update token if present, otherwise preserve the old token
          if (userData.token) {
            localStorage.setItem('token', userData.token);
          } else {
            // If token is missing from userData, ensure it is also present in the user object for future recovery
            const oldToken = localStorage.getItem('token');
            if (oldToken) {
              userData.token = oldToken;
              localStorage.setItem('user', JSON.stringify(userData));
            }
          }
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('Updated localStorage with new user data');

          toast({
            title: "Payment Successful",
            description: "Your services have been activated",
            variant: "success"
          })
          // No redirect here; handled by DashboardLayout.jsx
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
              ): status==="loading" ? (
                <Loader className="h-16 w-16 text-destructive" />
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