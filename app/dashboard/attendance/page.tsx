"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Employee {
  id: number
  employeeId: string
  name: string
  email: string
  designation: string
  departmentId: number
  department: { id: number; name: string; createdAt: string }
  salary: number
  role: string
  createdAt: string
  department_name: string
  employee_id: string
}

interface Attendance {
  id: number
  employeeId: number
  employee: Employee
  date: string
  status: string
  checkIn?: string
  checkOut?: string
  createdAt: string
}

export default function AttendancePage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState("2025-01-14")
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployees()
    fetchAttendanceRecords()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      const data = await response.json()
      setEmployees(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching employees:', error)
      setEmployees([])
    }
  }

  const fetchAttendanceRecords = async () => {
    try {
      // Mock attendance data for now
      const mockAttendance: Attendance[] = [
        { 
          id: 1, 
          employeeId: 1, 
          employee: employees[0] || { id: 1, employeeId: "EMP001", name: "John Doe", email: "john@company.com", designation: "Developer", departmentId: 1, department: { id: 1, name: "Engineering", createdAt: "2024-01-01" }, salary: 75000, role: "Developer", createdAt: "2024-01-15", department_name: "Engineering", employee_id: "EMP001" },
          date: "2025-01-14", 
          status: "present", 
          checkIn: "09:00", 
          checkOut: "17:00",
          createdAt: "2025-01-14T08:55:00Z"
        },
        { 
          id: 2, 
          employeeId: 2, 
          employee: employees[1] || { id: 2, employeeId: "EMP002", name: "Jane Smith", email: "jane@company.com", designation: "Designer", departmentId: 2, department: { id: 2, name: "Design", createdAt: "2024-01-01" }, salary: 65000, role: "Designer", createdAt: "2024-02-01", department_name: "Design", employee_id: "EMP002" },
          date: "2025-01-14", 
          status: "absent",
          createdAt: "2025-01-14T00:00:00Z"
        },
        { 
          id: 3, 
          employeeId: 3, 
          employee: employees[2] || { id: 3, employeeId: "EMP003", name: "Mike Johnson", email: "mike@company.com", designation: "Manager", departmentId: 3, department: { id: 3, name: "Operations", createdAt: "2024-01-01" }, salary: 85000, role: "Manager", createdAt: "2024-01-10", department_name: "Operations", employee_id: "EMP003" },
          date: "2025-01-14", 
          status: "late", 
          checkIn: "10:30", 
          checkOut: "18:00",
          createdAt: "2025-01-14T10:25:00Z"
        }
      ]
      setAttendanceRecords(mockAttendance)
    } catch (error) {
      console.error('Error fetching attendance:', error)
      setAttendanceRecords([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase' as const
    }

    switch (status) {
      case "present": 
        return <span style={{...baseStyle, backgroundColor: '#dcfce7', color: '#166534'}}>Present</span>
      case "absent": 
        return <span style={{...baseStyle, backgroundColor: '#fee2e2', color: '#991b1b'}}>Absent</span>
      case "late": 
        return <span style={{...baseStyle, backgroundColor: '#fef9c3', color: '#854d0e'}}>Late</span>
      default: 
        return <span style={{...baseStyle, backgroundColor: '#f3f4f6', color: '#374151'}}>{status}</span>
    }
  }

  const getEmployeeRecord = (employeeId: number) => {
    return attendanceRecords.find(record => record.employeeId === employeeId)
  }

  const handleLogout = () => {
    localStorage.removeItem("admin")
    localStorage.removeItem("userType")
    router.push("/login")
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f3f4f6', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ fontSize: '1.25rem', color: '#6b7280' }}>Loading attendance data...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '280px',
        backgroundColor: '#1f2937',
        color: 'white',
        height: '100vh',
        position: 'fixed',
        overflowY: 'auto'
      }}>
        <div style={{ 
          padding: '2rem 1.5rem',
          borderBottom: '1px solid #374151',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Admin Dashboard</h2>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Employee Management</p>
        </div>
        
        <nav style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href="/dashboard" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              backgroundColor: 'transparent', 
              color: '#d1d5db', 
              textDecoration: 'none', 
              fontSize: '14px', 
              fontWeight: '600',
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: '18px' }}>📊</span>
              <span>Dashboard</span>
            </a>
            <a href="/dashboard/employees" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              backgroundColor: 'transparent', 
              color: '#d1d5db', 
              textDecoration: 'none', 
              fontSize: '14px', 
              fontWeight: '600',
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: '18px' }}>👥</span>
              <span>Employees</span>
            </a>
            <a href="/dashboard/departments" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              backgroundColor: 'transparent', 
              color: '#d1d5db', 
              textDecoration: 'none', 
              fontSize: '14px', 
              fontWeight: '600',
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: '18px' }}>🏢</span>
              <span>Departments</span>
            </a>
            <a href="/dashboard/tasks" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              backgroundColor: 'transparent', 
              color: '#d1d5db', 
              textDecoration: 'none', 
              fontSize: '14px', 
              fontWeight: '600',
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: '18px' }}>✅</span>
              <span>Tasks</span>
            </a>
            <a href="/dashboard/attendance" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              backgroundColor: '#374151', 
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '14px', 
              fontWeight: '600',
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: '18px' }}>📅</span>
              <span>Attendance</span>
            </a>
            <a href="/dashboard/leaves" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              backgroundColor: 'transparent', 
              color: '#d1d5db', 
              textDecoration: 'none', 
              fontSize: '14px', 
              fontWeight: '600',
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: '18px' }}>🏖️</span>
              <span>Leaves</span>
            </a>
            <a href="/dashboard/salary" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              backgroundColor: 'transparent', 
              color: '#d1d5db', 
              textDecoration: 'none', 
              fontSize: '14px', 
              fontWeight: '600',
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: '18px' }}>💰</span>
              <span>Salary</span>
            </a>
            <a href="/dashboard/settings" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              backgroundColor: 'transparent', 
              color: '#d1d5db', 
              textDecoration: 'none', 
              fontSize: '14px', 
              fontWeight: '600',
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: '18px' }}>⚙️</span>
              <span>Settings</span>
            </a>
          </div>
        </nav>
        
        <div style={{ padding: '1rem', borderTop: '1px solid #374151', marginTop: 'auto' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#d1d5db',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontSize: '18px' }}>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '280px', flex: 1, minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>
                Attendance Management
              </h1>
              <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                Track and manage employee attendance records
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              <button style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{ padding: '2rem' }}>
          {/* Stats Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{ 
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>Present Today</h3>
                <span style={{ fontSize: '1.5rem' }}>✅</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#166534', marginBottom: '0.5rem' }}>
                {attendanceRecords.filter(r => r.status === 'present').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Employees present</div>
            </div>

            <div style={{ 
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>Absent Today</h3>
                <span style={{ fontSize: '1.5rem' }}>❌</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#991b1b', marginBottom: '0.5rem' }}>
                {attendanceRecords.filter(r => r.status === 'absent').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Employees absent</div>
            </div>

            <div style={{ 
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>Late Today</h3>
                <span style={{ fontSize: '1.5rem' }}>⏰</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#854d0e', marginBottom: '0.5rem' }}>
                {attendanceRecords.filter(r => r.status === 'late').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Employees late</div>
            </div>

            <div style={{ 
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>Attendance Rate</h3>
                <span style={{ fontSize: '1.5rem' }}>📊</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af', marginBottom: '0.5rem' }}>
                {employees.length > 0 ? Math.round((attendanceRecords.filter(r => r.status === 'present').length / employees.length) * 100) : 0}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Overall attendance</div>
            </div>
          </div>

          {/* Attendance Table */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employee ID</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employee</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Check In</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Check Out</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: 'white' }}>
                  {employees.map((employee) => {
                    const record = getEmployeeRecord(employee.id)
                    return (
                      <tr key={employee.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>{employee.employee_id || employee.id}</div>
                        </td>
                        <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>{employee.name}</div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{employee.designation || 'N/A'}</div>
                        </td>
                        <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{employee.department_name || 'N/A'}</div>
                        </td>
                        <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                          {record ? getStatusBadge(record.status) : <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: '#f3f4f6', color: '#374151' }}>No Record</span>}
                        </td>
                        <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                          {record?.checkIn || "-"}
                        </td>
                        <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                          {record?.checkOut || "-"}
                        </td>
                        <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: '0.875rem', fontWeight: '600' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #d1d5db',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              color: '#374151'
                            }}>
                              Edit
                            </button>
                            <button style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              color: '#6b7280'
                            }}>
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}