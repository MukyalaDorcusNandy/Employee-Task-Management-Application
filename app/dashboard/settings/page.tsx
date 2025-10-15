"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SettingsIcon, User, Lock, Bell } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("settings")
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@company.com",
    phone: "+1 234 567 8900",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleLogout = () => {
    document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push("/login")
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Profile updated successfully!")
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    alert("Password changed successfully!")
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
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
              System Settings
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <SettingsIcon style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>
              Settings
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {/* Profile Settings */}
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden'
            }}>
              <div style={{ 
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Profile Settings</h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                  Update your personal information
                </p>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    Update Profile
                  </button>
                </form>
              </div>
            </div>

            {/* Password Settings */}
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden'
            }}>
              <div style={{ 
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Change Password</h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                  Update your account password
                </p>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '14px'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '14px'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '14px'
                      }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    Change Password
                  </button>
                </form>
              </div>
            </div>

            {/* System Information */}
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden'
            }}>
              <div style={{ 
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>System Information</h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                  Application details and version
                </p>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>Application Name</span>
                    <span style={{ fontWeight: '500' }}>Employee Management System</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>Version</span>
                    <span style={{ fontWeight: '500' }}>1.0.0</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>Framework</span>
                    <span style={{ fontWeight: '500' }}>Next.js 15</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>Last Updated</span>
                    <span style={{ fontWeight: '500' }}>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}