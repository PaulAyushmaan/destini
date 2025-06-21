import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"

const cookieCategories = [
  {
    title: "Essential Cookies",
    description: "These cookies are necessary for the website to function and cannot be switched off in our systems.",
    examples: [
      "Session management",
      "Load balancing",
      "Security tokens",
      "User preferences"
    ]
  },
  {
    title: "Analytics Cookies",
    description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.",
    examples: [
      "Page views",
      "Traffic sources",
      "User behavior",
      "Site performance"
    ]
  },
  {
    title: "Functional Cookies",
    description: "These cookies enable the website to provide enhanced functionality and personalization.",
    examples: [
      "Language preferences",
      "Dark mode settings",
      "Location services",
      "Saved preferences"
    ]
  },
  {
    title: "Marketing Cookies",
    description: "These cookies may be set through our site by our advertising partners to build a profile of your interests.",
    examples: [
      "Ad targeting",
      "Social sharing",
      "Campaign tracking",
      "Partner integrations"
    ]
  }
]

export default function Cookies() {
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
                  Cookie Policy
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
              <h2>What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide useful information to the website owners.
              </p>

              <h2>How We Use Cookies</h2>
              <p>
                We use cookies for various purposes, including:
              </p>
              <ul>
                <li>Ensuring our website works properly</li>
                <li>Understanding how you use our website</li>
                <li>Remembering your preferences</li>
                <li>Improving our services</li>
                <li>Making our marketing more relevant</li>
              </ul>

              <h2>Types of Cookies We Use</h2>
              <div className="grid gap-8 mt-8">
                {cookieCategories.map((category, index) => (
                  <div key={index} className="rounded-lg border p-6 bg-card">
                    <h3 className="text-xl font-bold mb-3">{category.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {category.examples.map((example, i) => (
                        <div
                          key={i}
                          className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-md"
                        >
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <h2>Managing Cookies</h2>
              <p>
                Most web browsers allow you to manage cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.
              </p>

              <h2>Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about our Cookie Policy, please{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  contact us
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Cookie Settings CTA */}
        <section className="w-full py-12 md:py-16 bg-primary/5">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter">Cookie Settings</h2>
            <p className="text-lg text-muted-foreground">
              You can customize your cookie preferences at any time
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Button size="lg" className="px-8">
                Manage Preferences
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Accept All
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 