import { Button } from "@/components/ui/button"
import { Car, Clock, MapPin, Calendar, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import LogoutButton from '@/components/LogoutButton'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="grid gap-6">
      {/* Header Actions */}
      <div className="flex justify-end items-center mb-4">
        <LogoutButton />
      </div>
      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center gap-4 hover:border-primary"
          onClick={() => navigate('/user/book')}
        >
          <Car className="h-8 w-8 text-primary" />
          <div className="text-center">
            <h3 className="font-semibold">Book a Ride</h3>
            <p className="text-sm text-muted-foreground">Request transportation</p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center gap-4 hover:border-primary"
        >
          <Clock className="h-8 w-8 text-primary" />
          <div className="text-center">
            <h3 className="font-semibold">Schedule Later</h3>
            <p className="text-sm text-muted-foreground">Book for future</p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center gap-4 hover:border-primary"
        >
          <MapPin className="h-8 w-8 text-primary" />
          <div className="text-center">
            <h3 className="font-semibold">Saved Places</h3>
            <p className="text-sm text-muted-foreground">Manage locations</p>
          </div>
        </Button>
      </div>

      {/* Recent Rides */}
      <div className="rounded-xl border bg-card">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">Recent Rides</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {/* Ride 1 */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Campus to Downtown</h4>
                  <span className="text-sm text-muted-foreground">$12.50</span>
                </div>
                <p className="text-sm text-muted-foreground">March 25, 2024 - 2:30 PM</p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Ride 2 */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Library to Student Housing</h4>
                  <span className="text-sm text-muted-foreground">$8.75</span>
                </div>
                <p className="text-sm text-muted-foreground">March 24, 2024 - 5:45 PM</p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Ride 3 */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Mall to Campus</h4>
                  <span className="text-sm text-muted-foreground">$15.00</span>
                </div>
                <p className="text-sm text-muted-foreground">March 23, 2024 - 7:15 PM</p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button variant="link" className="mt-6 w-full">
            View All Rides
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Upcoming Rides */}
      <div className="rounded-xl border bg-card">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">Upcoming Rides</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {/* Scheduled Ride */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Campus to Airport</h4>
                  <span className="text-sm text-muted-foreground">$35.00</span>
                </div>
                <p className="text-sm text-muted-foreground">March 28, 2024 - 10:00 AM</p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    Scheduled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 