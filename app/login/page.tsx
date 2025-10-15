"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
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
          Employee Management System
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
                Welcome Back
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Sign in to continue to your account
              </p>
            </div>

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
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
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
                  onFocus={(e) => e.target.style.borderColor = '#0891b2'}
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
                  placeholder="••••••••"
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
                  onFocus={(e) => e.target.style.borderColor = '#0891b2'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      cursor: 'pointer',
                      accentColor: '#0891b2'
                    }}
                  />
                  <label 
                    htmlFor="remember" 
                    style={{ 
                      fontSize: '0.875rem', 
                      color: '#4b5563',
                      cursor: 'pointer'
                    }}
                  >
                    Remember me
                  </label>
                </div>
                <button 
                  type="button"
                  style={{ 
                    fontSize: '0.875rem', 
                    color: '#0891b2',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Forgot password?
                </button>
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
                  background: loading ? '#06b6d4' : 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 6px rgba(8, 145, 178, 0.3)',
                  transition: 'all 0.3s',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 12px rgba(8, 145, 178, 0.4)'
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(8, 145, 178, 0.3)'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ margin: '2rem 0', position: 'relative', textAlign: 'center' }}>
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: 0, 
                right: 0, 
                borderTop: '1px solid #e5e7eb' 
              }}></div>
              <span style={{ 
                position: 'relative', 
                background: 'white', 
                padding: '0 1rem',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                New to the platform?
              </span>
            </div>

            {/* Create Account */}
            <div style={{ textAlign: 'center' }}>
              <button 
                type="button"
                style={{ 
                  color: '#0891b2',
                  fontWeight: '600',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '0.95rem'
                }}
              >
                Create an account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}