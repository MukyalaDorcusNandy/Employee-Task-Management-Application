// app/dashboard/attendance/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Employee, Attendance as AttendanceType } from "@/lib/types/employee"

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState("2025-01-14")

  // Mock data using your proper types
  const employees: Employee[] = [
    {
      id: 1,
      employeeId: "EMP001",
      name: "John Doe",
      email: "john.doe@company.com",
      designation: "Senior Developer",
      departmentId: 1,
      department: { id: 1, name: "Engineering", createdAt: "2024-01-01" },
      salary: 75000,
      role: "Developer",
      createdAt: "2024-01-15",
      department_name: "",
      employee_id: ""
    },
    {
      id: 2,
      employeeId: "EMP002",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      designation: "UI/UX Designer",
      departmentId: 2,
      department: { id: 2, name: "Design", createdAt: "2024-01-01" },
      salary: 65000,
      role: "Designer",
      createdAt: "2024-02-01",
      department_name: "",
      employee_id: ""
    },
    {
      id: 3,
      employeeId: "EMP003",
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      designation: "Operations Manager",
      departmentId: 3,
      department: { id: 3, name: "Operations", createdAt: "2024-01-01" },
      salary: 85000,
      role: "Manager",
      createdAt: "2024-01-10",
      department_name: "",
      employee_id: ""
    },
    {
      id: 4,
      employeeId: "EMP004",
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      designation: "HR Specialist",
      departmentId: 4,
      department: { id: 4, name: "Human Resources", createdAt: "2024-01-01" },
      salary: 60000,
      role: "HR",
      createdAt: "2024-03-01",
      department_name: "",
      employee_id: ""
    }
  ]

  const attendanceRecords: AttendanceType[] = [
    { 
      id: 1, 
      employeeId: 1, 
      employee: employees[0],
      date: "2025-01-14", 
      status: "present", 
      checkIn: "09:00", 
      checkOut: "17:00",
      createdAt: "2025-01-14T08:55:00Z"
    },
    { 
      id: 2, 
      employeeId: 2, 
      employee: employees[1],
      date: "2025-01-14", 
      status: "absent",
      createdAt: "2025-01-14T00:00:00Z"
    },
    { 
      id: 3, 
      employeeId: 3, 
      employee: employees[2],
      date: "2025-01-14", 
      status: "late", 
      checkIn: "10:30", 
      checkOut: "18:00",
      createdAt: "2025-01-14T10:25:00Z"
    },
    { 
      id: 4, 
      employeeId: 4, 
      employee: employees[3],
      date: "2025-01-14", 
      status: "present", 
      checkIn: "08:45", 
      checkOut: "17:15",
      createdAt: "2025-01-14T08:40:00Z"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present": 
        return <Badge variant="success">Present</Badge>
      case "absent": 
        return <Badge variant="destructive">Absent</Badge>
      case "late": 
        return <Badge variant="warning">Late</Badge>
      default: 
        return <Badge>{status}</Badge>
    }
  }

  const getEmployeeRecord = (employeeId: number) => {
    return attendanceRecords.find(record => record.employeeId === employeeId)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance Management</h1>
        <div className="flex gap-4">
          <Input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <Button>Export Report</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => {
              const record = getEmployeeRecord(employee.id)
              return (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{employee.employeeId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    <div className="text-sm text-gray-500">{employee.designation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{employee.department?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record ? getStatusBadge(record.status) : <Badge variant="outline">No Record</Badge>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record?.checkIn || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record?.checkOut || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {attendanceRecords.filter(r => r.status === 'present').length}
          </div>
          <div className="text-sm text-green-800">Present Today</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">
            {attendanceRecords.filter(r => r.status === 'absent').length}
          </div>
          <div className="text-sm text-red-800">Absent Today</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">
            {attendanceRecords.filter(r => r.status === 'late').length}
          </div>
          <div className="text-sm text-yellow-800">Late Today</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round((attendanceRecords.filter(r => r.status === 'present').length / employees.length) * 100)}%
          </div>
          <div className="text-sm text-blue-800">Attendance Rate</div>
        </div>
      </div>
    </div>
  )
}