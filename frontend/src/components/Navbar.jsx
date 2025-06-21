import { Link } from "react-router-dom"
import { Car } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Car className="h-5 w-5" />
            <span>Destini</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Blog
            </Link>
            <Link to="/careers" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Careers
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/faqs" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              FAQs
            </Link>
            <Link to="/support" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Support
            </Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          <Button variant="default" size="sm" className="px-6">
            Book a Ride
          </Button>
        </div>
      </div>
    </header>
  )
} 