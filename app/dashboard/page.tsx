// app/dashboard/page.tsx - With inline styles (no Tailwind)
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleLogout = () => {
    document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
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
        <div style={{ fontSize: '1.25rem' }}>Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
        color: 'white',
        padding: '1.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          maxWidth: '80rem', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>
            Employee Management Dashboard
          </h1>
          <button 
            onClick={handleLogout}
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ 
        backgroundColor: 'white',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          maxWidth: '80rem', 
          margin: '0 auto',
          padding: '0 1.5rem'
        }}>
          <nav style={{ 
            display: 'flex', 
            gap: '2rem',
            padding: '1rem 0'
          }}>
            <Link href="/dashboard" style={{ 
              color: '#0891b2',
              fontWeight: '600',
              borderBottom: '2px solid #0891b2',
              paddingBottom: '0.5rem',
              textDecoration: 'none'
            }}>
              Overview
            </Link>
            <Link href="/dashboard/attendance" style={{ 
              color: '#6b7280',
              fontWeight: '600',
              paddingBottom: '0.5rem',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#0891b2'}
            onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              Attendance
            </Link>
            <Link href="/dashboard/employees" style={{ 
              color: '#6b7280',
              fontWeight: '600',
              paddingBottom: '0.5rem',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#0891b2'}
            onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              Employees
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '80rem', 
        margin: '0 auto', 
        padding: '1.5rem' 
      }}>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
            Welcome to Dashboard
          </h2>
          <p style={{ color: '#4b5563', marginTop: '0.5rem' }}>
            Select a section from the navigation menu above.
          </p>
        </div>
      </div>
    </div>
  )
}