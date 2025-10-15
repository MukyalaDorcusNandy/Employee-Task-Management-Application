"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Check, X } from "lucide-react"

export default function LeavesPage() {
  const router = useRouter()
  const [leaves, setLeaves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("leaves")

  useEffect(() => {
    // Mock data - replace with actual API call
    const timer = setTimeout(() => {
      setLeaves([
        {
          id: 1,
          employee_name: "John Doe",
          employee_code: "EMP001",
          leave_type: "Annual Leave",
          start_date: "2024-01-20",
          end_date: "2024-01-25",
          reason: "Family vacation",
          status: "pending"
        },
        {
          id: 2,
          employee_name: "Jane Smith",
          employee_code: "EMP002",
          leave_type: "Sick Leave",
          start_date: "2024-01-18",
          end_date: "2024-01-19",
          reason: "Medical appointment",
          status: "approved"
        },
        {
          id: 3,
          employee_name: "Robert Johnson",
          employee_code: "EMP003",
          leave_type: "Emergency Leave",
          start_date: "2024-01-22",
          end_date: "2024-01-22",
          reason: "Personal emergency",
          status: "rejected"
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

  const handleStatusUpdate = async (id: number, status: string) => {
    // Mock update - replace with actual API call
    setLeaves(leaves.map(leave => 
      leave.id === id ? { ...leave, status } : leave
    ))
  }

  const getStatusBadge = (status: string) => {
    const baseStyle = "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
    switch (status) {
      case "approved":
        return <span className={`${baseStyle} bg-green-500 text-white`}>Approved</span>
      case "rejected":
        return <span className={`${baseStyle} bg-red-500 text-white`}>Rejected</span>
      case "pending":
        return <span className={`${baseStyle} bg-yellow-500 text-white`}>Pending</span>
      default:
        return <span className={`${baseStyle} bg-gray-500 text-white`}>{status}</span>
    }
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
        <div style={{ fontSize: '1.25rem', color: '#6b7280' }}>Loading leave requests...</div>
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
              Leave Management
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
              Leave Requests
            </h2>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="h-4 w-4" />
              Add Leave Request
            </Button>
          </div>

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
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Employee</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Leave Type</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Start Date</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>End Date</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Reason</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: '600' }}>{leave.employee_name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{leave.employee_code}</div>
                      </td>
                      <td style={{ padding: '12px' }}>{leave.leave_type}</td>
                      <td style={{ padding: '12px' }}>{new Date(leave.start_date).toLocaleDateString()}</td>
                      <td style={{ padding: '12px' }}>{new Date(leave.end_date).toLocaleDateString()}</td>
                      <td style={{ padding: '12px', color: '#6b7280' }}>{leave.reason}</td>
                      <td style={{ padding: '12px' }}>{getStatusBadge(leave.status)}</td>
                      <td style={{ padding: '12px' }}>
                        {leave.status === "pending" && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(leave.id, "approved")}
                              className="text-green-600 hover:text-green-700 gap-1"
                            >
                              <Check className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(leave.id, "rejected")}
                              className="text-red-600 hover:text-red-700 gap-1"
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {leaves.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                No leave requests found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}