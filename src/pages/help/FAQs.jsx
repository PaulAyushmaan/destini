import { Link } from "react-router-dom"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Navbar from "@/components/Navbar"

const faqCategories = {
  general: [
    {
      question: "What is Destini?",
      answer: "Destini is a campus-focused transportation platform that connects students with reliable and affordable rides to and from campus. We partner with universities to provide safe, efficient, and cost-effective transportation solutions for the entire campus community."
    },
    {
      question: "How do I get started with Destini?",
      answer: "Getting started is easy! Simply download our app from your device's app store, create an account using your university email, and start booking rides. You can also invite friends to share rides and split fares."
    },
    {
      question: "Is Destini available at my university?",
      answer: "Destini is currently available at over 100 partner universities across the country. Check our website or app to see if your institution is listed. If not, let us know, and we'll work on expanding to your campus!"
    }
  ],
  students: [
    {
      question: "How do I split fares with friends?",
      answer: "Splitting fares is simple! When booking a ride, you can invite friends to join your ride group. The total fare will be automatically split equally among all participants, and each person can pay their share through the app."
    },
    {
      question: "Are the rates really cheaper than other services?",
      answer: "Yes! We offer competitive rates through our partnerships with universities and our efficient ride-sharing system. Plus, our fare-splitting feature and student discounts make rides even more affordable."
    },
    {
      question: "How safe is riding with Destini?",
      answer: "Safety is our top priority. All our drivers undergo thorough background checks, and we have real-time ride tracking, emergency assistance, and a rating system. Plus, our university partnerships add an extra layer of security."
    }
  ],
  schools: [
    {
      question: "How can our institution partner with Destini?",
      answer: "Contact our partnerships team through the website or email partners@destini.com. We'll work with you to create a customized transportation solution that meets your institution's specific needs."
    },
    {
      question: "What services are included for schools?",
      answer: "Our school partnerships include dedicated support, custom branding options, administrative dashboard, real-time analytics, integration with student IDs, and flexible payment options. We can also provide special event transportation services."
    },
    {
      question: "How does Destini ensure student safety?",
      answer: "We implement multiple safety measures including driver background checks, real-time ride monitoring, emergency response systems, and integration with campus security. We also provide detailed reporting and analytics for school administrators."
    }
  ]
}

export default function FAQs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedItems, setExpandedItems] = useState({})

  const toggleItem = (category, index) => {
    setExpandedItems(prev => ({
      ...prev,
      [`${category}-${index}`]: !prev[`${category}-${index}`]
    }))
  }

  const filterFAQs = () => {
    const query = searchQuery.toLowerCase()
    if (!query) return faqCategories

    const filtered = {}
    Object.entries(faqCategories).forEach(([category, items]) => {
      const matchingItems = items.filter(
        item =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      )
      if (matchingItems.length > 0) {
        filtered[category] = matchingItems
      }
    })
    return filtered
  }

  const filteredFAQs = filterFAQs()

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
                  Frequently Asked Questions
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                  Find answers to common questions about Destini's services
                </p>
              </div>
              <div className="w-full max-w-2xl relative mt-4">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-full border border-input bg-background hover:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="grid gap-12">
              {Object.entries(filteredFAQs).map(([category, items]) => (
                <div key={category} className="space-y-6">
                  <h2 className="text-2xl font-bold capitalize">
                    For {category === "general" ? "Everyone" : category}
                  </h2>
                  <div className="grid gap-4">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-input bg-card hover:border-ring transition-colors duration-200"
                      >
                        <button
                          className="flex w-full items-center justify-between p-6 text-left"
                          onClick={() => toggleItem(category, index)}
                        >
                          <span className="font-medium text-lg">{item.question}</span>
                          <ChevronDown
                            className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                              expandedItems[`${category}-${index}`] ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {expandedItems[`${category}-${index}`] && (
                          <div className="border-t border-input p-6">
                            <p className="text-muted-foreground text-base leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-16 text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                Can't find what you're looking for?
              </p>
              <div>
                <Link to="/contact">
                  <Button size="lg" className="px-8">Contact Support</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 