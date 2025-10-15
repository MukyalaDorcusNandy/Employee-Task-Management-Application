"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import { EmployeeFormDialog } from "@/components/employee-form-dialog"
import type { Employee } from "@/lib/types/employee"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEmployees()
  }, [])
  
  useEffect(() => {
    const filtered = employees.filter(
      (emp) =>
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredEmployees(filtered)
  }, [searchQuery, employees])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/employees")
      
      if (!response.ok) {
        throw new Error(`Failed to fetch employees: ${response.status}`)
      }
      
      const data = await response.json()
      setEmployees(data)
      setFilteredEmployees(data)
    } catch (error) {
      console.error("Error fetching employees:", error)
      setError("Failed to load employees from database")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchEmployees()
      } else {
        throw new Error("Failed to delete employee")
      }
    } catch (error) {
      console.error("Error deleting employee:", error)
      alert("Failed to delete employee. Please try again.")
    }
  }

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedEmployee(null)
    setDialogOpen(true)
  }

  const prevDialogOpen = useRef(dialogOpen)

  useEffect(() => {
    if (prevDialogOpen.current && !dialogOpen) {
      fetchEmployees()
    }
    prevDialogOpen.current = dialogOpen
  }, [dialogOpen])

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Employees Management</h1>
          <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-gray-200 h-20 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Employees Management</h1>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <Button 
            onClick={fetchEmployees} 
            className="mt-2 bg-red-600 hover:bg-red-700"
          >
            Retry
          </Button>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search employees by name, ID, email, position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Employee ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Position</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Salary</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Hire Date</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono">{employee.employee_id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {employee.first_name} {employee.last_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.position}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {employee.salary ? `$${employee.salary.toLocaleString()}` : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(employee)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(employee.id)}
                        className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50"
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

        {filteredEmployees.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            {searchQuery ? "No employees match your search" : "No employees found in database"}
          </div>
        )}
      </div>

      {employees.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>Showing {filteredEmployees.length} of {employees.length} employees</div>
        </div>
      )}

      <EmployeeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={selectedEmployee}
        onSave={() => {
          setDialogOpen(false)
          fetchEmployees()
        } } departments={[]}      />
    </div>
  )
}