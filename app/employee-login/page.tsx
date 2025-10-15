"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function EmployeeLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Direct validation - NO API CALL
    const validEmployees = [
      { email: "john@company.com", password: "123456" },
      { email: "maya.hajjat@company.com", password: "123456" },
      { email: "dorcus.nandy@company.com", password: "123456" },
      { email: "joy.ndimu@company.com", password: "123456" }
    ]

    const isValid = validEmployees.some(emp => 
      emp.email === email && emp.password === password
    )

    if (isValid) {
      // Create mock employee data
      const employeeData = {
        id: 1,
        employee_id: "EMP001",
        first_name: email.split('@')[0].split('.')[0],
        last_name: "Employee", 
        email: email,
        position: "Software Developer",
        department_id: 1,
        hire_date: "2024-01-01"
      }

      // Store in localStorage
      localStorage.setItem("employee", JSON.stringify(employeeData))
      localStorage.setItem("userType", "employee")
      
      // Redirect to dashboard
      router.push("/employees-dashboard")
    } else {
      setError("Invalid email or password")
    }
    
    setLoading(false)
  }

  const fillTestCredentials = (testEmail: string) => {
    setEmail(testEmail)
    setPassword("123456")
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        padding: '3rem 2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: 'white',
          margin: 0,
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          Employee Portal
        </h1>
      </div>

      {/* Centered Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Login Card */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '2.5rem',
            border: '1px solid #e5e7eb'
          }}>
            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                Employee Login
              </h2>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                margin: 0
              }}>
                Sign in with your company email
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>⚠️</span>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '0' }}>
              {/* Email */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label 
                  htmlFor="email" 
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}
                >
                  Company Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    fontSize: '1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    outline: 'none',
                    transition: 'all 0.2s ease-in-out',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#059669'
                    e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label 
                  htmlFor="password"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    fontSize: '1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    outline: 'none',
                    transition: 'all 0.2s ease-in-out',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#059669'
                    e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'white',
                  background: loading 
                    ? '#059669' 
                    : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 6px rgba(5, 150, 105, 0.3)',
                  transition: 'all 0.3s ease-in-out',
                  opacity: loading ? 0.7 : 1,
                  marginBottom: '1rem',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(5, 150, 105, 0.4)'
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(5, 150, 105, 0.3)'
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Signing in...
                  </span>
                ) : (
                  'Sign In as Employee'
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div style={{
              marginTop: '2rem',
              padding: '1.25rem',
              backgroundColor: '#ecfdf5',
              borderRadius: '0.75rem',
              border: '1px solid #a7f3d0'
            }}>
              <p style={{
                margin: '0 0 0.5rem 0',
                fontWeight: '600',
                color: '#065f46',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>🚀</span>
                Test with any employee:
              </p>
              <p style={{
                margin: '0 0 1rem 0',
                fontSize: '0.875rem',
                color: '#047857',
                lineHeight: '1.4'
              }}>
                Use any employee email below<br/>
                Password: <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>123456</span>
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {[
                  { email: "john@company.com", name: "John" },
                  { email: "maya.hajjat@company.com", name: "Maya" },
                  { email: "dorcus.nandy@company.com", name: "Dorcus" },
                  { email: "joy.ndimu@company.com", name: "Joy" }
                ].map((employee) => (
                  <button
                    key={employee.email}
                    onClick={() => fillTestCredentials(employee.email)}
                    style={{
                      padding: '0.375rem 0.75rem',
                      backgroundColor: 'transparent',
                      border: '1px solid #059669',
                      color: '#059669',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669'
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = '#059669'
                    }}
                  >
                    {employee.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Admin Login Link */}
            <div style={{
              textAlign: 'center',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <p style={{
                margin: '0 0 0.5rem 0',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                Are you an administrator?
              </p>
              <a 
                href="/login" 
                style={{
                  color: '#0891b2',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  transition: 'color 0.2s ease-in-out'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#0e7490'}
                onMouseOut={(e) => e.currentTarget.style.color = '#0891b2'}
              >
                Go to Admin Login →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Add spinning animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}