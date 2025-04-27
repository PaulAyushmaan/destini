import { Link } from "react-router-dom"
import { LifeBuoy, Mail, MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"

const supportChannels = [
  {
    icon: Phone,
    title: "Phone Support",
    description: "Available 24/7 for urgent assistance",
    action: "Call Now",
    link: "tel:1-800-DESTINI"
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email within 24 hours",
    action: "Send Email",
    link: "mailto:support@destini.com"
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    action: "Start Chat",
    link: "#chat"
  },
  {
    icon: LifeBuoy,
    title: "Help Center",
    description: "Browse our knowledge base and FAQs",
    action: "Visit FAQs",
    link: "/faqs"
  }
]

const commonIssues = [
  {
    title: "Account & Login",
    items: [
      "Reset your password",
      "Update account information",
      "Link university email",
      "Verify student status"
    ]
  },
  {
    title: "Rides & Bookings",
    items: [
      "Schedule a ride",
      "Cancel or modify booking",
      "Split fare with friends",
      "Track your ride"
    ]
  },
  {
    title: "Payments & Billing",
    items: [
      "Payment methods",
      "Billing history",
      "Refund status",
      "Student discounts"
    ]
  }
]

export default function Support() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-10 md:py-16 bg-gradient-to-b from-background via-background/95 to-background/90">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="space-y-3 text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Support Center
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                  Get help with your Destini account and services
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Support Channels */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {supportChannels.map((channel, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:border-ring transition-all duration-300"
                >
                  <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary to-primary/50 opacity-0 blur transition group-hover:opacity-10"></div>
                  <div className="relative space-y-4">
                    <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <channel.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-xl">{channel.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {channel.description}
                      </p>
                    </div>
                    <Link to={channel.link}>
                      <Button variant="outline" className="w-full">
                        {channel.action}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Issues */}
        <section className="w-full py-12 md:py-16 bg-primary/5">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">Common Issues</h2>
                <p className="text-lg text-muted-foreground">
                  Find quick solutions to frequently encountered problems
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                {commonIssues.map((category, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-xl font-bold">{category.title}</h3>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link
                            to="#"
                            className="text-muted-foreground hover:text-primary hover:underline"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter">Still Need Help?</h2>
            <p className="text-lg text-muted-foreground">
              Our support team is here to assist you with any questions or concerns
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Link to="/contact">
                <Button size="lg" className="px-8">Contact Support</Button>
              </Link>
              <Link to="/faqs">
                <Button variant="outline" size="lg" className="px-8">View FAQs</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 