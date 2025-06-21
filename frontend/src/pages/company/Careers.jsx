import { Link } from "react-router-dom"
import { Briefcase, MapPin, Clock, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"

const jobs = [
  {
    title: "Senior Software Engineer",
    location: "San Francisco, CA",
    type: "Full-time",
    department: "Engineering",
    description: "Join our core engineering team to build and scale our transportation platform."
  },
  {
    title: "Product Manager",
    location: "New York, NY",
    type: "Full-time",
    department: "Product",
    description: "Lead product strategy and development for our campus transportation solutions."
  },
  {
    title: "University Partnership Manager",
    location: "Remote",
    type: "Full-time",
    department: "Business Development",
    description: "Drive partnerships with universities and manage key institutional relationships."
  },
  {
    title: "UX/UI Designer",
    location: "Los Angeles, CA",
    type: "Full-time",
    department: "Design",
    description: "Create beautiful and intuitive experiences for our mobile and web platforms."
  }
]

const perks = [
  {
    title: "Flexible Work",
    description: "Work from anywhere with flexible hours and unlimited PTO."
  },
  {
    title: "Health Benefits",
    description: "Comprehensive health, dental, and vision coverage for you and your family."
  },
  {
    title: "Career Growth",
    description: "Professional development stipend and mentorship opportunities."
  },
  {
    title: "Team Events",
    description: "Regular team building activities and annual company retreats."
  }
]

export default function Careers() {
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
                  Join Our Team
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                  Help us revolutionize campus transportation and make a difference
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter">Open Positions</h2>
              <div className="grid gap-6">
                {jobs.map((job, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:border-ring transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-xl">{job.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{job.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span>{job.department}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground pt-2">
                          {job.description}
                        </p>
                      </div>
                      <Button className="md:self-start whitespace-nowrap">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Perks Section */}
        <section className="w-full py-12 md:py-16 bg-primary/5">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tighter">Why Join Destini?</h2>
                <p className="text-lg text-muted-foreground">
                  We offer competitive benefits and a great work environment
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {perks.map((perk, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-bold text-xl">{perk.title}</h3>
                    <p className="text-muted-foreground">{perk.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter">Don't see the right role?</h2>
            <p className="text-lg text-muted-foreground">
              Send us your resume and we'll keep you in mind for future opportunities
            </p>
            <Button size="lg" className="mt-4">
              <Briefcase className="mr-2 h-5 w-5" />
              Submit Resume
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
} 