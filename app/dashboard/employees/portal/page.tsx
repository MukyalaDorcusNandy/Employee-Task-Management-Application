// app/dashboard/employees/portal/page.tsx
"use client"

import { useRouter } from "next/navigation"

export default function EmployeePortal() {
  const router = useRouter()

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      padding: '2rem'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
          Employee Portal
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Welcome to your employee dashboard! Here you can view your assigned tasks.
        </p>
        
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '1.5rem', 
          borderRadius: '6px',
          border: '1px solid #4CAF50'
        }}>
          <h2 style={{ color: '#2e7d32', marginBottom: '1rem' }}>Your Tasks</h2>
          <p style={{ color: '#666' }}>Task management features will be implemented here.</p>
        </div>

        <button 
          onClick={() => router.push('/')}
          style={{
            marginTop: '2rem',
            backgroundColor: '#2196F3',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}