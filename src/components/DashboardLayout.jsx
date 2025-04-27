import { Link, Outlet, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Settings,
  Car,
  Wallet,
  LogOut,
  GraduationCap,
  School,
  Calendar,
  BarChart,
  CreditCard,
  MapPin,
  Bike,
  Bus,
  UserPlus,
  FileSpreadsheet,
  Bell,
  Menu,
  User,
  ChevronDown,
  Search,
  LayoutGrid
} from "lucide-react"

const portalConfig = {
  college: {
    name: "College Portal",
    logo: <School className="h-6 w-6" />,
    unpaidNavigation: [
      { name: "Select Services", href: "/college/select-services", icon: Car },
    ],
    navigation: [
      { 
        name: "Dashboard", 
        href: "/college", 
        icon: LayoutDashboard,
        description: "Overview and analytics"
      },
      { 
        name: "Students", 
        href: "/college/students", 
        icon: Users,
        description: "Manage student accounts"
      },
      { 
        name: "Services", 
        href: "/college/services", 
        icon: Car,
        description: "Configure transport services"
      },
      { 
        name: "Settings", 
        href: "/college/settings", 
        icon: Settings,
        description: "Account preferences"
      },
    ],
  },
  user: {
    name: "User Portal",
    logo: <GraduationCap className="h-6 w-6" />,
    navigation: [
      { 
        name: "Dashboard", 
        href: "/user", 
        icon: LayoutDashboard,
        description: "Your overview"
      },
      { 
        name: "Rides", 
        href: "/user/rides", 
        icon: Car,
        description: "Book and manage rides"
      },
      { 
        name: "Payments", 
        href: "/user/payments", 
        icon: Wallet,
        description: "Transaction history"
      },
      { 
        name: "Settings", 
        href: "/user/settings", 
        icon: Settings,
        description: "Account settings"
      },
    ],
  },
  driver: {
    name: "Driver Portal",
    logo: <Car className="h-6 w-6" />,
    navigation: [
      { 
        name: "Dashboard", 
        href: "/driver", 
        icon: LayoutDashboard,
        description: "Your overview"
      },
      { 
        name: "Rides", 
        href: "/driver/rides", 
        icon: Car,
        description: "Manage your rides"
      },
      { 
        name: "Earnings", 
        href: "/driver/earnings", 
        icon: Wallet,
        description: "Payment history"
      },
      { 
        name: "Settings", 
        href: "/driver/settings", 
        icon: Settings,
        description: "Account settings"
      },
    ],
  },
}

export default function DashboardLayout({ portal = "user", children }) {
  const location = useLocation()
  const config = portalConfig[portal]
  
  // For testing: Set to true to simulate paid state
  const isPaid = true
  const isCollegeUnpaid = portal === "college" && !isPaid && location.pathname !== "/college/select-services"

  const navigationItems = isCollegeUnpaid 
    ? config.unpaidNavigation 
    : config.navigation

  // Get current page name
  const currentPage = navigationItems.find(item => item.href === location.pathname)

  return (
    <div className="flex h-screen bg-background">
      {/* Fixed Sidebar */}
      <div className="w-80 flex flex-col border-r bg-card">
        {/* Logo Section */}
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Car className="h-6 w-6 text-primary" />
            <span>Destini</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 p-6">
          <nav className="space-y-6">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex items-start gap-4 rounded-lg p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  location.pathname === item.href && "bg-accent text-accent-foreground"
                )}
              >
                <item.icon className="h-6 w-6 shrink-0" />
                <div>
                  <div className="font-medium text-foreground">{item.name}</div>
                  <div className="text-sm">{item.description}</div>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Profile Section - Fixed at Bottom */}
        <div className="border-t p-6">
          <button className="flex w-full items-center gap-4 rounded-lg p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <span className="font-medium">JD</span>
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-foreground">John Doe</div>
              <div className="text-sm">john.doe@example.com</div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{currentPage?.name || "Dashboard"}</h1>
            <div className="flex items-center gap-4">
              <button className="relative">
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  4
                </span>
                <Bell className="h-6 w-6" />
              </button>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {isCollegeUnpaid ? (
            <div className="py-12">
              <div className="max-w-4xl mx-auto text-center">
                <div className="p-4 rounded-full bg-primary/10 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Car className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Complete Your Registration</h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Please select and pay for the services you want to enable for your college.
                </p>
                <Button size="lg" className="px-8" asChild>
                  <Link to="/college/select-services">Select Services</Link>
                </Button>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
} 