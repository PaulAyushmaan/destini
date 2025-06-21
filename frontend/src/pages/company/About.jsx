import { Link } from "react-router-dom"
import { Users, Target, Leaf, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"

const stats = [
  { label: "Active Users", value: "50K+" },
  { label: "Partner Universities", value: "100+" },
  { label: "Cities", value: "25+" },
  { label: "Rides Completed", value: "1M+" }
]

const values = [
  {
    icon: Users,
    title: "Community First",
    description: "Building strong relationships with educational institutions, students, and drivers."
  },
  {
    icon: Target,
    title: "Innovation",
    description: "Continuously improving our platform with cutting-edge technology."
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Promoting eco-friendly transportation options and reducing carbon footprint."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Maintaining high standards in service quality and safety."
  }
]

export default function About() {
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
                  About Destini
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                  Reimagining campus transportation for a better commuting experience
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-16 bg-primary/5">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center justify-center space-y-2">
                  <div className="text-3xl font-bold text-primary md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Mission</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  At Destini, we're on a mission to revolutionize campus transportation. We believe that getting to and from campus should be affordable, efficient, and sustainable. Our platform connects educational institutions, students, and drivers to create a seamless transportation ecosystem.
                </p>
              </div>
              <div className="aspect-video relative rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1495314736024-fa5e4b37b979?q=80&w=2072&auto=format&fit=crop" 
                  alt="Campus"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="w-full py-12 md:py-16 bg-primary/5">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">
                The principles that guide everything we do at Destini
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:border-ring transition-all duration-300">
                  <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary to-primary/50 opacity-0 blur transition group-hover:opacity-10"></div>
                  <div className="relative space-y-4">
                    <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-xl">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 aspect-video relative rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                  alt="Team"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="space-y-4 order-1 lg:order-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Story</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Founded in 2024, Destini emerged from a simple observation: campus transportation needed a modern solution. What started as a small initiative has grown into a comprehensive platform serving multiple institutions and thousands of students across the country.
                </p>
                <div className="flex gap-4">
                  <Link to="/careers">
                    <Button size="lg">Join Our Team</Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" size="lg">Contact Us</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 