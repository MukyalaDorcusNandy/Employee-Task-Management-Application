"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"
import type { Employee } from "@/lib/types/employee"

export default function SalaryPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees")
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      console.error("[v0] Error fetching employees:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalSalary = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0)

  if (loading) {
    return <div className="text-center py-12">Loading salary information...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">Salary Management</h1>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg bg-white/20 flex items-center justify-center">
            <DollarSign className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm opacity-90">Total Monthly Payroll</p>
            <p className="text-4xl font-bold">${totalSalary.toLocaleString()}</p>
            <p className="text-sm opacity-75 mt-1">{employees.length} employees</p>
          </div>
        </div>
      </div>

      {/* Salary Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Employee ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Department</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Designation</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Monthly Salary</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {employees.map((employee: any) => (
                <tr key={employee.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm text-foreground">{employee.employee_id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{employee.name}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{employee.department_name || "-"}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{employee.designation || "-"}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">
                    {employee.salary ? `$${employee.salary.toLocaleString()}` : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {employees.length === 0 && <div className="text-center py-12 text-muted-foreground">No employees found</div>}
      </div>
    </div>
  )
}
