import { Link } from "react-router-dom"
import { Car, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <Car className="h-6 w-6" />
            <span>Destini</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contact Us</h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Get in touch with our team. We're here to help.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-5xl space-y-12 py-12">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Send us a message</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Your message"
                        value={formData.message}
                        onChange={handleChange}
                        className="h-32 w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Contact Information</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      You can also reach us through these channels:
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          support@destini.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          +1 (234) 567-8900
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-medium">Office</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          123 Campus Drive<br />
                          University City, ST 12345<br />
                          United States
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Business Hours</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 