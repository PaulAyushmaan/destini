import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"

export default function Terms() {
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
                  Terms of Service
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                  Last updated: March 27, 2024
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Destini's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>

              <h2>2. Service Description</h2>
              <p>
                Destini provides a platform connecting students with transportation services to and from campus. Our services include ride-sharing, shuttle services, and related transportation solutions.
              </p>

              <h2>3. User Accounts</h2>
              <p>
                To use our services, you must create an account using your university email address. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
              </p>

              <h2>4. User Conduct</h2>
              <p>
                You agree to use our services in accordance with all applicable laws and regulations. Prohibited activities include but are not limited to:
              </p>
              <ul>
                <li>Violating any laws or regulations</li>
                <li>Harassing or discriminating against other users</li>
                <li>Interfering with the proper functioning of the service</li>
                <li>Attempting to gain unauthorized access to our systems</li>
              </ul>

              <h2>5. Payment Terms</h2>
              <p>
                All payments are processed securely through our platform. Prices for services are clearly displayed before booking. You agree to pay all charges associated with your use of our services.
              </p>

              <h2>6. Cancellation Policy</h2>
              <p>
                Cancellation policies vary by service type. Please review the specific cancellation terms provided at the time of booking. Refunds will be processed according to these policies.
              </p>

              <h2>7. Privacy</h2>
              <p>
                Your privacy is important to us. Our collection and use of personal information is governed by our{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>

              <h2>8. Limitation of Liability</h2>
              <p>
                Destini is not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
              </p>

              <h2>9. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our platform.
              </p>

              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about these Terms of Service, please{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  contact us
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 