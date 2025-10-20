"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
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
      setEmployees(Array.isArray(data) ? data : [])
      setFilteredEmployees(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching employees:", error)
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
      console.error("Error deleting employee:", error)
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
        const response = await fetch(`/api/employees/${selectedEmployee.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            salary: parseInt(formData.salary)
          }),
        })

        if (response.ok) {
          fetchEmployees()
        }
      } else {
        // Add new employee
        const response = await fetch("/api/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            salary: parseInt(formData.salary)
          }),
        })

        if (response.ok) {
          fetchEmployees()
        }
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
      console.error("Error saving employee:", error)
    }
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
        <div style={{ fontSize: '1.25rem', color: '#6b7280' }}>Loading employees...</div>
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
              backgroundColor: '#374151', 
              color: 'white', 
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
              backgroundColor: 'transparent', 
              color: '#d1d5db', 
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
                Employees
              </h1>
              <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                Manage your team members and their information
              </p>
            </div>
            <button 
              onClick={handleAdd}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '16px' }}>➕</span>
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{ padding: '2rem' }}>
          {/* Search Bar */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ position: 'relative', maxWidth: '400px' }}>
              <span style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                fontSize: '16px', 
                color: '#6b7280' 
              }}>🔍</span>
              <input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
              />
            </div>
          </div>

          {/* Employees Table */}
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
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Designation</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Salary</th>
                    <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: 'white' }}>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: '#111827' }}>{employee.employeeId}</td>
                      <td style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>{employee.name}</td>
                      <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: '#6b7280' }}>{employee.email}</td>
                      <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: '#111827' }}>{employee.department || "-"}</td>
                      <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: '#111827' }}>{employee.designation || "-"}</td>
                      <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: '#111827' }}>
                        {employee.salary ? `$${employee.salary.toLocaleString()}` : "-"}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.875rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleEdit(employee)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              padding: '0.5rem',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              color: '#6b7280',
                              fontSize: '16px'
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              padding: '0.5rem',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              color: '#ef4444',
                              fontSize: '16px'
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredEmployees.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                {searchQuery ? "No employees match your search" : "No employees found"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Employee Form Modal */}
      {dialogOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
                {selectedEmployee ? "Edit Employee" : "Add Employee"}
              </h2>
              <button
                onClick={() => setDialogOpen(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#6b7280'
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Salary</label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Join Date</label>
                <input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: '1px solid #d1d5db',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{
                    flex: 1,
                    backgroundColor: '#3b82f6',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'white'
                  }}
                >
                  {selectedEmployee ? "Update" : "Add"} Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}