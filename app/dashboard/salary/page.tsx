"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DollarSign } from "lucide-react"

export default function SalaryPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("salary")

  useEffect(() => {
    // Mock data - replace with actual API call
    const timer = setTimeout(() => {
      setEmployees([
        {
          id: 1,
          employee_id: "EMP001",
          name: "John Doe",
          department_name: "IT",
          designation: "Software Engineer",
          salary: 75000
        },
        {
          id: 2,
          employee_id: "EMP002", 
          name: "Jane Smith",
          department_name: "HR",
          designation: "HR Manager",
          salary: 65000
        },
        {
          id: 3,
          employee_id: "EMP003",
          name: "Robert Johnson",
          department_name: "Finance",
          designation: "Accountant",
          salary: 60000
        },
        {
          id: 4,
          employee_id: "EMP004",
          name: "Sarah Williams",
          department_name: "Marketing",
          designation: "Marketing Manager",
          salary: 70000
        }
      ])
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleLogout = () => {
    document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push("/login")
  }

  const totalSalary = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0)

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f3f4f6', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ fontSize: '1.25rem', color: '#6b7280' }}>Loading salary information...</div>
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Employee MS</h2>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Management System</p>
        </div>
        
        <nav style={{ padding: '1.5rem 1rem' }}>
          {[
            { id: "overview", label: "Overview", icon: "📊", path: "/dashboard" },
            { id: "attendance", label: "Attendance", icon: "📅", path: "/dashboard/attendance" },
            { id: "employees", label: "Employees", icon: "👥", path: "/dashboard/employees" },
            { id: "departments", label: "Departments", icon: "🏢", path: "/dashboard/departments" },
            { id: "leaves", label: "Leaves", icon: "🏖️", path: "/dashboard/leaves" },
            { id: "salary", label: "Salary", icon: "💰", path: "/dashboard/salary" },
            { id: "settings", label: "Settings", icon: "⚙️", path: "/dashboard/settings" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '8px',
                backgroundColor: activeSection === item.id ? '#374151' : 'transparent',
                color: activeSection === item.id ? 'white' : '#d1d5db',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.backgroundColor = '#374151'
                }
              }}
              onMouseOut={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
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
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>
              Salary Management
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '40px',
                height: '40px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '14px'
              }}>
                A
              </div>
              <span style={{ color: '#374151', fontWeight: '600' }}>Admin User</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>
              Employee Salaries
            </h2>
          </div>

          {/* Summary Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign style={{ width: '32px', height: '32px' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Monthly Payroll</div>
                <div style={{ fontSize: '2.25rem', fontWeight: '700' }}>${totalSalary.toLocaleString()}</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.75, marginTop: '0.25rem' }}>
                  {employees.length} employees
                </div>
              </div>
            </div>
          </div>

          {/* Salary Table */}
          <div style={{ 
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Employee ID</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Department</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Designation</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Monthly Salary</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px' }}>{employee.employee_id}</td>
                      <td style={{ padding: '12px', fontWeight: '600' }}>{employee.name}</td>
                      <td style={{ padding: '12px' }}>{employee.department_name}</td>
                      <td style={{ padding: '12px' }}>{employee.designation}</td>
                      <td style={{ padding: '12px', fontWeight: '600' }}>
                        ${employee.salary?.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: '#dcfce7',
                          color: '#166534'
                        }}>
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {employees.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                No employees found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}