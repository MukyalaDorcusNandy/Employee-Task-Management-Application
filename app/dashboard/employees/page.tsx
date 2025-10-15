"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Pencil, Trash2, X } from "lucide-react"

interface Employee {
  id: number
  employeeId: string
  name: string
  email: string
  department: string
  designation: string
  salary: number
  joinDate: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    salary: "",
    joinDate: ""
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    const filtered = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredEmployees(filtered)
  }, [searchQuery, employees])

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees")
      const data = await response.json()
      setEmployees(data)
      setFilteredEmployees(data)
    } catch (error) {
      console.error("[v0] Error fetching employees:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return

    try {
      // Mock delete - in real app, call DELETE API
      setEmployees(employees.filter(emp => emp.id !== id))
      setFilteredEmployees(filteredEmployees.filter(emp => emp.id !== id))
    } catch (error) {
      console.error("[v0] Error deleting employee:", error)
    }
  }

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee)
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      designation: employee.designation,
      salary: employee.salary.toString(),
      joinDate: employee.joinDate
    })
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedEmployee(null)
    setFormData({
      name: "",
      email: "",
      department: "",
      designation: "",
      salary: "",
      joinDate: ""
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (selectedEmployee) {
        // Update existing employee
        const updatedEmployee = {
          ...selectedEmployee,
          ...formData,
          salary: parseInt(formData.salary)
        }
        
        setEmployees(employees.map(emp => 
          emp.id === selectedEmployee.id ? updatedEmployee : emp
        ))
      } else {
        // Add new employee
        const newEmployee: Employee = {
          id: employees.length + 1,
          employeeId: `EMP${String(employees.length + 1).padStart(3, '0')}`,
          name: formData.name,
          email: formData.email,
          department: formData.department,
          designation: formData.designation,
          salary: parseInt(formData.salary),
          joinDate: formData.joinDate
        }
        
        setEmployees([...employees, newEmployee])
      }
      
      setDialogOpen(false)
      setFormData({
        name: "",
        email: "",
        department: "",
        designation: "",
        salary: "",
        joinDate: ""
      })
    } catch (error) {
      console.error("[v0] Error saving employee:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading employees...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">Employees</h1>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Employee ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Department</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Designation</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Salary</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm text-foreground">{employee.employeeId}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{employee.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{employee.email}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{employee.department || "-"}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{employee.designation || "-"}</td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {employee.salary ? `$${employee.salary.toLocaleString()}` : "-"}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEdit(employee)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(employee.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {searchQuery ? "No employees match your search" : "No employees found"}
          </div>
        )}
      </div>

      {/* Employee Form Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {selectedEmployee ? "Edit Employee" : "Add Employee"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDialogOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <Input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Designation</label>
                <Input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Salary</label>
                <Input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Join Date</label>
                <Input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {selectedEmployee ? "Update" : "Add"} Employee
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}