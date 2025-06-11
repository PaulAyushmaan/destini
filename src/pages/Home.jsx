import { Link } from "react-router-dom"
import { ArrowRight, BookOpen, Car, GraduationCap, School, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from '@/components/theme-toggle';
import { useEffect } from "react"

const navigationItems = ["Features", "How It Works", "Pricing", "Contact"]

const features = [
  {
    icon: School,
    title: "For Schools",
    description: "Enroll your institution to provide affordable transportation options for students and staff. Get free marketing in return."
  },
  {
    icon: GraduationCap,
    title: "For Students",
    description: "Access discounted rides, shuttle services, and campus rentals. Split fares with friends and save on transportation costs."
  },
  {
    icon: Car,
    title: "For Drivers",
    description: "Earn more than traditional rideshare platforms. Get consistent rides from schools and regular users."
  }
]

const steps = [
  {
    number: "1",
    title: "Schools Enroll",
    description: "Educational institutions register and select services they want to offer to their students and staff."
  },
  {
    number: "2",
    title: "Students Register",
    description: "Students use their school-provided credentials to access discounted transportation services."
  },
  {
    number: "3",
    title: "Drivers Connect",
    description: "Drivers join the platform to provide rides for both students and regular users."
  }
]

const plans = [
  {
    title: "For Schools",
    description: "Custom pricing based on selected services",
    features: [
      "Cab services for students",
      "Shuttle routes",
      "Campus rentals (bikes, e-bikes)",
      "Free marketing included"
    ],
    cta: "Contact for Pricing",
    link: "/register?type=school"
  },
  {
    title: "For Students",
    description: "Discounted rates through your institution",
    features: [
      "Lower than market rates",
      "Ride sharing with friends",
      "Split fare functionality",
      "Free campus rentals"
    ],
    cta: "Register with School ID",
    link: "/register?type=student",
    popular: true
  },
  {
    title: "For Drivers",
    description: "Better earnings than traditional platforms",
    features: [
      "Higher earnings",
      "Consistent school rides",
      "Regular user rides",
      "Flexible schedule"
    ],
    cta: "Become a Driver",
    link: "/register?type=driver"
  }
]

export default function Home() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="flex min-h-screen flex-col antialiased">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-xl transition-colors hover:text-primary">
            <Car className="h-6 w-6 text-primary" />
            <span>Destini</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-10">
            {navigationItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, "-"))}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {item}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" className="font-medium hover:text-primary text-sm h-9">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm h-9 px-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-all duration-300">
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-8 md:py-12 lg:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          <div className="container relative px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-6">
                  <h1 className="hero-heading flex flex-col gap-5">
                    <div>Transportation</div>
                    <div>Reimagined for</div>
                    <div>Education</div>
                  </h1>
                  <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
                    Destini connects schools, students, and drivers in one seamless platform. Experience affordable rides, efficient campus solutions, and a better way to commute.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Link to="/register">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-all duration-300 h-12 px-8">
                      Get Started <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="inline-flex items-center justify-center h-12 px-8 border border-primary/20 hover:border-primary/40 rounded-md font-medium transition-all duration-200 group"
                  >
                    Learn More <BookOpen className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="flex items-center gap-8 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>10+ Schools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>1000+ Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>100+ Drivers</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end mr-8">
                <div className="relative aspect-square w-full max-w-[500px]">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-primary/50 opacity-70 blur-2xl"></div>
                  <div className="relative rounded-2xl border border-primary/10 bg-background/95 p-2 backdrop-blur-sm">
                    <img
                      alt="Destini App Preview"
                      className="rounded-xl shadow-2xl"
                      src="/images/app-preview.png"
                    />
                    <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-2xl border border-primary/10 bg-background/95 p-4 shadow-xl backdrop-blur-sm">
                      <div className="flex h-full flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-primary">50%</span>
                        <span className="text-xs text-muted-foreground">Save on Rides</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  <span>Features</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features for Everyone</h2>
                <p className="max-w-[900px] text-lg text-muted-foreground md:text-xl">
                  Destini offers tailored solutions for schools, students, and drivers
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-16 md:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="group relative flex flex-col items-center space-y-4 rounded-2xl border p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200">
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary to-primary/50 opacity-0 blur transition group-hover:opacity-10"></div>
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-center text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="relative w-full py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-muted/50"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  <span>Process</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200">How It Works</h2>
                <p className="max-w-[900px] text-lg text-muted-foreground md:text-xl">
                  Our platform connects schools, students, and drivers in a seamless ecosystem
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl py-16">
              <div className="relative">
                {/* Steps */}
                <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-12 relative">
                  {steps.map((step, index) => (
                    <div key={index} className="group relative">
                      {/* Connection line for desktop */}
                      {index < steps.length - 1 && (
                        <div className="hidden md:block absolute top-8 left-[100%] w-[calc(100%-2rem)] h-[2px] -translate-x-1/2">
                          <div className="absolute h-full w-full bg-gradient-to-r from-primary/50 via-primary/50 to-primary/50"></div>
                          {/* Arrow */}
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3">
                            <div className="absolute inset-0 rotate-45 border-t-2 border-r-2 border-primary/50"></div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col items-center">
                        {/* Number Circle with Effects */}
                        <div className="relative mb-6 md:mb-8">
                          {/* Ripple effect circles */}
                          <div className="absolute -inset-2 rounded-full border-2 border-dashed border-primary/20 group-hover:border-primary/30 group-hover:scale-105 transition-all duration-500"></div>
                          <div className="absolute -inset-4 rounded-full border border-primary/20 group-hover:border-primary/30 group-hover:scale-105 transition-all duration-500"></div>
                          
                          {/* Main circle */}
                          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-110">
                            <span className="text-2xl font-bold">{step.number}</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="relative space-y-4 text-center">
                          <div className="h-[2px] w-8 bg-primary/50 mx-auto mb-4 group-hover:w-12 transition-all duration-300"></div>
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                          <p className="text-muted-foreground leading-relaxed max-w-[250px] mx-auto">
                            {step.description}
                          </p>
                        </div>

                        {/* Mobile arrow */}
                        {index < steps.length - 1 && (
                          <div className="md:hidden absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-primary/50">
                            <div className="h-8 w-[2px] bg-gradient-to-b from-primary/50 to-primary/50"></div>
                            <div className="h-3 w-3 rotate-45 border-r-2 border-b-2 border-primary/50"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  <span>Pricing</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Affordable options for all users</h2>
                <p className="max-w-[900px] text-lg text-muted-foreground md:text-xl">
                  Choose the plan that best fits your needs
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-16 md:grid-cols-3">
              {plans.map((plan, index) => (
                <div key={index} className="group relative flex flex-col rounded-2xl border p-8 hover:border-primary/50 hover:shadow-lg transition-all duration-200">
                  {plan.popular && (
                    <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Most Popular
                    </div>
                  )}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{plan.title}</h3>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>
                  <ul className="my-8 space-y-3 text-muted-foreground">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={plan.link} className="mt-auto">
                    <Button className="w-full shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-all duration-300">
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="relative w-full py-20 md:py-32">
          <div className="absolute inset-0 bg-muted/50"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  <span>Contact</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Get in Touch</h2>
                <p className="max-w-[900px] text-lg text-muted-foreground md:text-xl">
                  Have questions? Our team is here to help you 24/7
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-lg space-y-4 py-16">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Name
                  </label>
                  <input
                    className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Email
                  </label>
                  <input
                    type="email"
                    className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Message
                  </label>
                  <textarea
                    className="flex min-h-[120px] w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-all duration-300">
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl transition-colors hover:text-primary">
                <Car className="h-6 w-6 text-primary" />
                <span>Destini</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Reimagining campus transportation for a better commuting experience.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                  </svg>
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
                </li>
                <li>
                  <Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link>
                </li>
                <li>
                  <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col space-y-4">
              <h3 className="text-sm font-medium">Help</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/faqs" className="text-muted-foreground hover:text-primary transition-colors">FAQs</Link>
                </li>
                <li>
                  <Link to="/support" className="text-muted-foreground hover:text-primary transition-colors">Support</Link>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("contact")} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div className="flex flex-col space-y-4">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms</Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors">Cookies</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Destini. All rights reserved.
            </p>
            <div className="flex justify-center items-center gap-4">
              <img src="/images/payment/visa.svg" alt="Visa" className="h-8" />
              <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-8" />
              <img src="/images/payment/amex.svg" alt="American Express" className="h-8" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 