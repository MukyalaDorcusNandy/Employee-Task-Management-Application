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

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store employee data
        localStorage.setItem("employee", JSON.stringify(data.user))
        localStorage.setItem("userType", "employee")
        
        // Redirect to employee dashboard
        router.push("/dashboard/employee")
      } else {
        setError(data.error || "Invalid email or password")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setEmail("john@company.com")
    setPassword("123456")
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: 'white',
          margin: 0
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
        <div style={{ width: '100%', maxWidth: '450px' }}>
          {/* Login Card */}
          <div style={{ 
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            padding: '3rem',
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
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Sign in to view your tasks and information
              </p>
            </div>

            {error && (
              <div style={{ 
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
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
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
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
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'white',
                  background: loading ? '#059669' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 6px rgba(5, 150, 105, 0.3)',
                  transition: 'all 0.3s',
                  opacity: loading ? 0.7 : 1,
                  marginBottom: '1rem'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 12px rgba(5, 150, 105, 0.4)'
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(5, 150, 105, 0.3)'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In as Employee'}
              </button>
            </form>

            {/* Demo Credentials */}
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: '#ecfdf5', 
              borderRadius: '8px',
              border: '1px solid #a7f3d0'
            }}>
              <p style={{ 
                margin: '0 0 8px 0', 
                fontWeight: '500', 
                color: '#065f46',
                fontSize: '0.875rem'
              }}>
                Demo Employee credentials:
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: '#047857' }}>
                john@company.com / 123456
              </p>
              <button
                onClick={fillDemoCredentials}
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'transparent',
                  border: '1px solid #059669',
                  color: '#059669',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}
              >
                Fill Demo Credentials
              </button>
            </div>

            {/* Admin Login Link */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: '#6b7280' }}>
                Are you an administrator?
              </p>
              <a 
                href="/login" 
                style={{ 
                  color: '#0891b2', 
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}
              >
                Go to Admin Login →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}