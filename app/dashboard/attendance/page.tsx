"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, Check, X } from "lucide-react"
import type { Employee, Attendance } from "@/lib/types/employee"

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    fetchAttendance()
  }, [selectedDate])

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

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`/api/attendance?date=${selectedDate}`)
      const data = await response.json()
      setAttendance(data)
    } catch (error) {
      console.error("[v0] Error fetching attendance:", error)
    }
  }

  const markAttendance = async (employeeId: number, status: string) => {
    try {
      const now = new Date()
      const time = now.toTimeString().split(" ")[0]

      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          date: selectedDate,
          checkIn: status === "present" ? time : null,
          status,
        }),
      })

      fetchAttendance()
    } catch (error) {
      console.error("[v0] Error marking attendance:", error)
    }
  }

  const getAttendanceStatus = (employeeId: number) => {
    const record = attendance.find((a: any) => a.employee_id === employeeId)
    return record?.status || null
  }

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">Not Marked</Badge>
    switch (status) {
      case "present":
        return <Badge className="bg-green-500 hover:bg-green-600">Present</Badge>
      case "absent":
        return <Badge className="bg-red-500 hover:bg-red-600">Absent</Badge>
      case "late":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Late</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading attendance...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">Attendance Management</h1>
      </div>

      {/* Date Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {attendance.length} of {employees.length} marked
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Employee ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Department</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Status</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {employees.map((employee: any) => {
                const status = getAttendanceStatus(employee.id)
                return (
                  <tr key={employee.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 text-sm text-foreground">{employee.employee_id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{employee.name}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{employee.department_name || "-"}</td>
                    <td className="px-6 py-4 text-sm">{getStatusBadge(status)}</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAttendance(employee.id, "present")}
                          className="text-green-600 hover:text-green-700 gap-1"
                          disabled={status === "present"}
                        >
                          <Check className="h-4 w-4" />
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAttendance(employee.id, "absent")}
                          className="text-red-600 hover:text-red-700 gap-1"
                          disabled={status === "absent"}
                        >
                          <X className="h-4 w-4" />
                          Absent
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {employees.length === 0 && <div className="text-center py-12 text-muted-foreground">No employees found</div>}
      </div>
    </div>
  )
}
