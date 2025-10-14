"use client"

import { useEffect, useState } from "react"
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
      const response = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchEmployees()
      }
    } catch (error) {
      console.error("[v0] Error deleting employee:", error)
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
                  <td className="px-6 py-4 text-sm text-foreground">{(employee as any).department_name || "-"}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{employee.designation || "-"}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{employee.salary ? `$${employee.salary}` : "-"}</td>
                  <td className="px-6 py-4 text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(employee)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(employee.id)}
                        className="text-destructive hover:text-destructive"
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
          <div className="text-center py-12 text-muted-foreground">No employees found</div>
        )}
      </div>

      <EmployeeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={selectedEmployee}
        onSuccess={fetchEmployees}
      />
    </div>
  )
}
