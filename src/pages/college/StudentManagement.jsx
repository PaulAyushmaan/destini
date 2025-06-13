import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { Toaster, toast } from "sonner"
import { 
  Upload, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FileSpreadsheet,
  UserPlus,
  MoreVertical,
  Download
} from "lucide-react"

const API_BASE = 'http://localhost:4000';

export default function StudentManagement() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    studentId: ''
  });
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [fetchingStudents, setFetchingStudents] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5; // Number of students per page

  // Filter students based on search query and status
  const filteredStudents = students.filter(student => {
    const matchesSearch = searchQuery.trim() === '' || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && student.isVerified) ||
      (statusFilter === 'inactive' && !student.isVerified);

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination values
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  // Handle page navigation
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  // Fetch students
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/users/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch students');
      }

      const data = await response.json();
      console.log('Fetched students:', data); // Debug log
      if (data.success && Array.isArray(data.students)) {
        setStudents(data.students);
      } else {
        console.error('Unexpected data format:', data);
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students: ' + error.message);
      setStudents([]);
    } finally {
      setFetchingStudents(false);
    }
  };

  // Fetch students on component mount and after successful registration
  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchStudents();
    } else {
      setFetchingStudents(false);
      toast.error('Please login to view students');
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Modified handleSubmit to refresh student list after successful registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const defaultPassword = formData.fullName.toLowerCase().replace(/\s+/g, '');
      const registrationData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        studentId: formData.studentId,
        password: defaultPassword,
        role: 'student'
      };

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.message?.includes('duplicate')) {
          throw new Error('A student with this email already exists');
        }
        throw new Error(data.message || 'Failed to register student');
      }

      toast.success(`Student ${formData.fullName} registered successfully!`, {
        description: (
          <div className="mt-2 space-y-1">
            <p>Student ID: {formData.studentId}</p>
            <p>Email: {formData.email}</p>
            <p className="font-medium">Default Password: {defaultPassword}</p>
            <p className="text-sm text-gray-500 mt-2">Please share these credentials with the student.</p>
          </div>
        ),
        duration: 5000
      });

      // Clear form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        studentId: ''
      });

      // Refresh student list
      fetchStudents();

    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration Failed', {
        description: error.message,
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster richColors position="top-right" />
      <div className="flex flex-col md:flex-row gap-4">
        {/* Bulk Import Card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Bulk Import
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input 
                    type="file" 
                    accept=".csv,.xlsx" 
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
                  />
                </div>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Manual Entry Card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Manual Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter student name"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="student@example.com"
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input 
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Student ID</Label>
                    <Input 
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      placeholder="Enter student ID"
                      required 
                    />
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                {loading ? 'Adding Student...' : 'Add Student'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              Student List
            </CardTitle>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, email, ID..." 
                  className="pl-9 w-[300px]"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <Select 
                value={statusFilter} 
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Phone</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Student ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fetchingStudents ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Loading students...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      {students.length === 0 ? 'No students found' : 'No matching students found'}
                    </td>
                  </tr>
                ) : (
                  currentStudents.map((student) => (
                    <tr key={student._id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4">{student.name}</td>
                      <td className="p-4">{student.email}</td>
                      <td className="p-4">{student.phone}</td>
                      <td className="p-4">{student.studentId}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          student.isVerified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {student.isVerified ? 'Active' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {searchQuery || statusFilter !== 'all' 
                ? `Showing ${startIndex + 1}-${Math.min(endIndex, filteredStudents.length)} of ${filteredStudents.length} students`
                : `Showing ${startIndex + 1}-${Math.min(endIndex, students.length)} of ${students.length} students`}
            </p>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 