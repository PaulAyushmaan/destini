import { useState } from "react"
import { Link } from "react-router-dom"
import { Car, School, GraduationCap, Bike, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Register() {
  const [selectedRole, setSelectedRole] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    // Additional fields based on role
    institutionName: "",
    studentId: "",
    licenseNumber: "",
  })

  const roles = [
    {
      id: "school",
      title: "School/College",
      icon: School,
      description: "Register your institution to provide transportation services",
      color: "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20",
      extraFields: ["institutionName"]
    },
    {
      id: "student",
      title: "Student/Faculty",
      icon: GraduationCap,
      description: "Get access to discounted rides and campus services",
      color: "bg-green-500/10 text-green-500 group-hover:bg-green-500/20",
      extraFields: ["studentId"]
    },
    {
      id: "driver",
      title: "Driver",
      icon: Bike,
      description: "Join as a driver and earn more with consistent rides",
      color: "bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20",
      extraFields: ["licenseNumber"]
    }
  ]

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission based on role
    console.log('Form submitted:', { role: selectedRole, ...formData })
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
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="container flex flex-col items-center py-20 md:py-32">
          <div className="mx-auto w-full max-w-[850px] space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Create an Account</h1>
              <p className="text-lg text-muted-foreground">Choose how you want to join Destini</p>
            </div>

            {!selectedRole ? (
              // Role Selection
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200 text-center"
                  >
                    <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary to-primary/50 opacity-0 blur transition group-hover:opacity-10"></div>
                    <div className="flex flex-col items-center">
                      <div className={`relative flex h-16 w-16 items-center justify-center rounded-full ${role.color} transition-colors mb-6`}>
                        <role.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{role.title}</h3>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // Registration Form
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-normal"
                    onClick={() => setSelectedRole(null)}
                  >
                    ← Back to role selection
                  </Button>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Full Name</label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Password</label>
                      <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Confirm Password</label>
                      <input
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Phone Number</label>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>

                  {/* Role-specific fields */}
                  {selectedRole === "school" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Institution Name</label>
                      <input
                        name="institutionName"
                        type="text"
                        value={formData.institutionName}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter your institution name"
                        required
                      />
                    </div>
                  )}

                  {selectedRole === "student" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Student/Faculty ID</label>
                      <input
                        name="studentId"
                        type="text"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter your ID number"
                        required
                      />
                    </div>
                  )}

                  {selectedRole === "driver" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Driver's License Number</label>
                      <input
                        name="licenseNumber"
                        type="text"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter your license number"
                        required
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Create Account
                </Button>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium text-primary hover:underline">
                    Log in
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 