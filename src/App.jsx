import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from './components/theme-provider'
import DashboardLayout from './components/DashboardLayout'

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

// User Portal Pages
import UserDashboard from '@/pages/user/Dashboard'
import UserRides from '@/pages/user/Rides'
import UserPayments from '@/pages/user/Payments'
import UserSettings from '@/pages/user/Settings'
import BookRide from '@/pages/user/BookRide'

// Driver Portal Pages
import DriverDashboard from '@/pages/driver/Dashboard'
import DriverRides from '@/pages/driver/Rides'
import DriverEarnings from '@/pages/driver/Earnings'
import DriverSettings from '@/pages/driver/Settings'

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
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
          <Route path="/college" element={<DashboardLayout portal="college"><CollegeDashboard /></DashboardLayout>} />
          <Route path="/college/services" element={<DashboardLayout portal="college"><CollegeServices /></DashboardLayout>} />
          <Route path="/college/students" element={<DashboardLayout portal="college"><StudentManagement /></DashboardLayout>} />
          <Route path="/college/settings" element={<DashboardLayout portal="college"><CollegeSettings /></DashboardLayout>} />
          <Route path="/college/select-services" element={<DashboardLayout portal="college"><ServiceSelection /></DashboardLayout>} />

          {/* User Portal Routes */}
          <Route path="/user" element={<DashboardLayout portal="user"><UserDashboard /></DashboardLayout>} />
          <Route path="/user/book" element={<DashboardLayout portal="user"><BookRide /></DashboardLayout>} />
          <Route path="/user/rides" element={<DashboardLayout portal="user"><UserRides /></DashboardLayout>} />
          <Route path="/user/payments" element={<DashboardLayout portal="user"><UserPayments /></DashboardLayout>} />
          <Route path="/user/settings" element={<DashboardLayout portal="user"><UserSettings /></DashboardLayout>} />

          {/* Driver Portal Routes */}
          <Route path="/driver" element={<DashboardLayout portal="driver"><DriverDashboard /></DashboardLayout>} />
          <Route path="/driver/rides" element={<DashboardLayout portal="driver"><DriverRides /></DashboardLayout>} />
          <Route path="/driver/earnings" element={<DashboardLayout portal="driver"><DriverEarnings /></DashboardLayout>} />
          <Route path="/driver/settings" element={<DashboardLayout portal="driver"><DriverSettings /></DashboardLayout>} />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App 