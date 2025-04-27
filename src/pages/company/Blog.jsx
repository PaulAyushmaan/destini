import { Link } from "react-router-dom"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"

const blogPosts = [
  {
    title: "The Future of Campus Transportation",
    excerpt: "Exploring how technology and sustainability are shaping the way students commute to and from campus.",
    author: "Sarah Johnson",
    date: "March 25, 2024",
    category: "Innovation",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    readTime: "5 min read",
    featured: true
  },
  {
    title: "Safety First: Our Commitment to Student Security",
    excerpt: "Learn about our comprehensive safety measures and how we ensure secure rides for every student.",
    author: "Michael Chen",
    date: "March 23, 2024",
    category: "Safety",
    image: "https://images.unsplash.com/photo-1557411732-1797a9171fcf?q=80&w=2070&auto=format&fit=crop",
    readTime: "4 min read"
  },
  {
    title: "Sustainable Campus Commuting",
    excerpt: "How Destini is helping universities reduce their carbon footprint through efficient transportation.",
    author: "Emma Davis",
    date: "March 20, 2024",
    category: "Sustainability",
    image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=2070&auto=format&fit=crop",
    readTime: "6 min read"
  },
  {
    title: "Partner Success Story: State University",
    excerpt: "How one of our university partners transformed their campus transportation system.",
    author: "David Wilson",
    date: "March 18, 2024",
    category: "Case Study",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop",
    readTime: "7 min read"
  }
]

const categories = ["All", "Innovation", "Safety", "Sustainability", "Case Study"]

export default function Blog() {
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
                  Latest Updates
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                  Stay informed about Destini's latest news, insights, and stories
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={category === "All" ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {blogPosts.filter(post => post.featured).map((post, index) => (
          <section key={index} className="w-full py-12 md:py-16 bg-primary/5">
            <div className="container px-4 md:px-6 max-w-5xl mx-auto">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium text-primary">{post.category}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <Button className="group">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
                <div className="aspect-video relative rounded-xl overflow-hidden">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Blog Posts Grid */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.filter(post => !post.featured).map((post, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg border bg-background hover:border-ring transition-all duration-300">
                  <div className="aspect-video relative">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium text-primary">{post.category}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold">{post.title}</h3>
                      <p className="text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 