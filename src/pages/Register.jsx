import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Car, School, GraduationCap, Bike, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

const API_BASE = 'http://localhost:4000';

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
    // Additional fields for driver/captain
    lastName: "",
    vehicleColor: "",
    vehiclePlate: "",
    vehicleCapacity: "",
    vehicleType: "car", // Default value
  })
  const navigate = useNavigate();

  const roles = [
    {
      id: "college",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      let endpoint = `${API_BASE}/auth/register`;
      let requestBody = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: selectedRole,
      };

      // Handle different role-specific data
      if (selectedRole === 'student') {
        requestBody.studentId = formData.studentId;
      } else if (selectedRole === 'college') {
        requestBody.institutionName = formData.institutionName;
      } else if (selectedRole === 'driver') {
        // Use the captain registration endpoint for drivers
        endpoint = `${API_BASE}/captains/register`;
        requestBody = {
          fullname: {
            firstname: formData.name,
            lastname: formData.lastName
          },
          email: formData.email,
          password: formData.password,
          vehicle: {
            color: formData.vehicleColor,
            plate: formData.vehiclePlate,
            capacity: parseInt(formData.vehicleCapacity),
            vehicleType: formData.vehicleType
          }
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'  // Important for cookies
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Make sure we have a token before storing it
      if (!data.token) {
        throw new Error('No token received from server');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      
      if (selectedRole === 'driver') {
        if (!data.captain) {
          throw new Error('No driver data received');
        }
        localStorage.setItem('driverId', data.captain._id);
        localStorage.setItem('driverData', JSON.stringify(data.captain));
        navigate('/driver');
        return;
      }

      if (!data.user) {
        throw new Error('No user data received');
      }
      
      // For college and student roles
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      switch (selectedRole) {
        case 'student':
          navigate('/user');
          break;
        case 'college':
          navigate('/college');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      alert(error.message);
    }
  };

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
                  {selectedRole === "college" && (
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
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Last Name</label>
                        <input
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Enter your last name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Vehicle Color</label>
                        <input
                          name="vehicleColor"
                          type="text"
                          value={formData.vehicleColor}
                          onChange={handleInputChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Enter vehicle color"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Vehicle Plate Number</label>
                        <input
                          name="vehiclePlate"
                          type="text"
                          value={formData.vehiclePlate}
                          onChange={handleInputChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Enter vehicle plate number"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Vehicle Capacity</label>
                        <input
                          name="vehicleCapacity"
                          type="number"
                          value={formData.vehicleCapacity}
                          onChange={handleInputChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Enter vehicle capacity"
                          min="1"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Vehicle Type</label>
                        <select
                          name="vehicleType"
                          value={formData.vehicleType}
                          onChange={handleInputChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        >
                          <option value="car">Car</option>
                          <option value="motorcycle">Motorcycle</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>
                    </>
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