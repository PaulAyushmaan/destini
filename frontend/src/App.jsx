import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { ThemeProvider } from './components/theme-provider'
import DashboardLayout from './components/DashboardLayout'
import SocketProvider from '@/lib/SocketContext'
import { DriverProvider } from '@/contexts/DriverContext'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'

// Public Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

// College Portal Pages
import CollegeDashboard from '@/pages/college/Dashboard'
import CollegeServices from '@/pages/college/Services'
import CollegeSettings from '@/pages/college/Settings'
import StudentManagement from '@/pages/college/StudentManagement'
import ServiceSelection from '@/pages/college/ServiceSelection'
import PaymentSuccess from '@/pages/college/PaymentSuccess'
import MarketingInsights from '@/pages/college/MarketingInsights'
import CampusShuttle from './pages/college/services/CampusShuttle'
import CabService from './pages/college/services/CabService'
import BikeRental from './pages/college/services/BikeRental'

// User Portal Pages
import UserDashboard from '@/pages/user/Dashboard'
import UserRides from '@/pages/user/Rides'
import UserPayments from '@/pages/user/Payments'
import UserSettings from '@/pages/user/Settings'
import BookRide from '@/pages/user/BookRide'
import AwaitingDriver from './pages/user/AwaitingDriver'
import RideCompleted from './pages/user/RideCompleted'
import ScheduleRide from '@/pages/user/ScheduleRide'
import ScheduledRideDetails from '@/pages/user/ScheduledRideDetails'
import ManageScheduledRides from '@/pages/user/ManageScheduledRides'

// Driver Portal Pages
import DriverDashboard from '@/pages/driver/Dashboard'
import DriverRides from '@/pages/driver/Rides'
import DriverEarnings from '@/pages/driver/Earnings'
import DriverSettings from '@/pages/driver/Settings'
import RideDetails from './pages/driver/RideDetails'

// Company Pages
import About from "@/pages/company/About"
import Careers from "@/pages/company/Careers"
import Blog from "@/pages/company/Blog"

// Help Pages
import FAQs from "@/pages/help/FAQs"
import Support from "@/pages/help/Support"
import Contact from "@/pages/help/Contact"

// Legal Pages
import Terms from "@/pages/legal/Terms"
import Privacy from "@/pages/legal/Privacy"
import Cookies from "@/pages/legal/Cookies"

import './styles/globals.css'

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <DriverProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              <Route path="/" element={<Home />} />

              {/* Company Routes */}
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/blog" element={<Blog />} />

              {/* Help Routes */}
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/support" element={<Support />} />
              <Route path="/contact" element={<Contact />} />

              {/* Legal Routes */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<Cookies />} />

              {/* College Portal Routes */}
              <Route element={<PrivateRoute allowedRoles={['college']} />}>
                <Route path="/college" element={<DashboardLayout portal="college"><CollegeDashboard /></DashboardLayout>} />
                <Route path="/college/services" element={<DashboardLayout portal="college"><CollegeServices /></DashboardLayout>} />
                <Route path="/college/students" element={<DashboardLayout portal="college"><StudentManagement /></DashboardLayout>} />
                <Route path="/college/settings" element={<DashboardLayout portal="college"><CollegeSettings /></DashboardLayout>} />
                <Route path="/college/select-services" element={<DashboardLayout portal="college"><ServiceSelection /></DashboardLayout>} />
                <Route path="/college/payment-success" element={<DashboardLayout portal="college"><PaymentSuccess /></DashboardLayout>} />
                <Route path="/college/marketing-insights" element={<DashboardLayout portal="college"><MarketingInsights /></DashboardLayout>} />
                <Route path="/college/services/shuttle" element={<DashboardLayout portal="college"><CampusShuttle /></DashboardLayout>} />
                <Route path="/college/services/cab" element={<DashboardLayout portal="college"><CabService /></DashboardLayout>} />
                <Route path="/college/services/bike" element={<DashboardLayout portal="college"><BikeRental /></DashboardLayout>} />
              </Route>

              {/* User Portal Routes */}
              <Route element={<PrivateRoute allowedRoles={['student']} />}>
                <Route path="/user" element={<DashboardLayout portal="user"><UserDashboard /></DashboardLayout>} />
                <Route path="/user/book" element={<DashboardLayout portal="user"><BookRide /></DashboardLayout>} />
                <Route path="/user/schedule" element={<DashboardLayout portal="user"><ScheduleRide /></DashboardLayout>} />
                <Route path="/user/scheduled-details" element={<DashboardLayout portal="user"><ScheduledRideDetails /></DashboardLayout>} />
                <Route path="/user/rides" element={<DashboardLayout portal="user"><UserRides /></DashboardLayout>} />
                <Route path="/user/payments" element={<DashboardLayout portal="user"><UserPayments /></DashboardLayout>} />
                <Route path="/user/settings" element={<DashboardLayout portal="user"><UserSettings /></DashboardLayout>} />
                <Route path="/user/awaiting-driver/:rideId" element={<AwaitingDriver />} />
                <Route path="/user/ride-completed/:rideId" element={<RideCompleted />} />
                <Route path="/user/manage-scheduled" element={<DashboardLayout portal="user"><ManageScheduledRides /></DashboardLayout>} />
              </Route>

              {/* Driver Routes */}
              <Route path="/driver/login" element={<Login />} />
              <Route element={<PrivateRoute allowedRoles={['driver']} />}>
                <Route path="/driver" element={<DashboardLayout portal="driver"><DriverDashboard /></DashboardLayout>} />
                <Route path="/driver/rides" element={<DashboardLayout portal="driver"><DriverRides /></DashboardLayout>} />
                <Route path="/driver/earnings" element={<DashboardLayout portal="driver"><DriverEarnings /></DashboardLayout>} />
                <Route path="/driver/settings" element={<DashboardLayout portal="driver"><DriverSettings /></DashboardLayout>} />
                <Route path="/driver/ride/:rideId" element={<RideDetails />} />
              </Route>

              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </DriverProvider>
      </SocketProvider>
    </ThemeProvider>
  )
}

export default App