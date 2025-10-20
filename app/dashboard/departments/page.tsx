"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Department {
  id: number
  name: string
  description?: string
  createdAt: string
}

export default function DepartmentsPage() {
  const router = useRouter()
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments")
      const data = await response.json()
      setDepartments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching departments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this department?")) return

    try {
      const response = await fetch(`/api/departments/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchDepartments()
      }
    } catch (error) {
      console.error("Error deleting department:", error)
    }
  }

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department)
    setFormData({
      name: department.name,
      description: department.description || ""
    })
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedDepartment(null)
    setFormData({
      name: "",
      description: ""
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (selectedDepartment) {
        // Update existing department
        const response = await fetch(`/api/departments/${selectedDepartment.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          fetchDepartments()
        }
      } else {
        // Add new department
        const response = await fetch("/api/departments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          fetchDepartments()
        }
      }
      
      setDialogOpen(false)
      setFormData({
        name: "",
        description: ""
      })
    } catch (error) {
      console.error("Error saving department:", error)
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
        <div style={{ fontSize: '1.25rem', color: '#6b7280' }}>Loading departments...</div>
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
              backgroundColor: '#374151', 
              color: 'white', 
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
                Departments
              </h1>
              <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                Organize your company structure and teams
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
              <span>Add Department</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{ padding: '2rem' }}>
          {/* Departments Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {departments.map((department) => (
              <div
                key={department.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ 
                      height: '48px', 
                      width: '48px', 
                      borderRadius: '8px', 
                      backgroundColor: '#fbbf24', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <span style={{ fontSize: '24px', color: 'white' }}>👥</span>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>{department.name}</h3>
                    </div>
                  </div>
                </div>

                {department.description && (
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280', 
                    marginBottom: '1rem', 
                    margin: 0,
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {department.description}
                  </p>
                )}

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  paddingTop: '1rem', 
                  borderTop: '1px solid #e5e7eb' 
                }}>
                  <button 
                    onClick={() => handleEdit(department)} 
                    style={{
                      flex: 1,
                      backgroundColor: 'transparent',
                      border: '1px solid #d1d5db',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>✏️</span>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(department.id)}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #d1d5db',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      color: '#ef4444'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {departments.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              color: '#6b7280',
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
              <p style={{ margin: 0, fontSize: '1rem' }}>No departments found. Add your first department to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Department Form Modal */}
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
                {selectedDepartment ? "Edit Department" : "Add Department"}
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
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Department Name</label>
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
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    resize: 'vertical'
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
                  {selectedDepartment ? "Update" : "Add"} Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}