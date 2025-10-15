// app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">
      <header className="header">
        <h1>Employee Task Management System</h1>
        <p>Complete employee management solution for your organization</p>
      </header>

      <div className="grid">
        <div className="card">
          <h3>📋 Task Management</h3>
          <p>Create, assign, and track employee tasks efficiently</p>
          <Link href="/login" className="button primary">
            Go to Dashboard
          </Link>
        </div>

        <div className="card">
          <h3>👥 Employee Portal</h3>
          <p>Employee login to view assigned tasks and progress</p>   
         <Link href="/employee-login" className="button secondary">
        Employee Login
        </Link>
        </div>

        <div className="card">
          <h3>📊 Performance Analytics</h3>
          <p>Track productivity and generate performance reports</p>
          <button className="button tertiary">
            View Reports
          </button>
        </div>
      </div>

      <div className="stats-section">
        <h3>System Overview</h3>
        <div className="stats-grid">
          <div className="stat">
            <h4>Active Employees</h4>
            <p className="stat-number">24</p>
          </div>
          <div className="stat">
            <h4>Pending Tasks</h4>
            <p className="stat-number">18</p>
          </div>
          <div className="stat">
            <h4>Completed Today</h4>
            <p className="stat-number">42</p>
          </div>
          <div className="stat">
            <h4>Teams</h4>
            <p className="stat-number">6</p>
          </div>
        </div>
      </div>
    </div>
  )
}