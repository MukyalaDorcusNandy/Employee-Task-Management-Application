"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function EmployeesDashboard() {
  const router = useRouter()
  const [employee, setEmployee] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const data = localStorage.getItem("employee")
    if (!data) {
      router.push("/employee-login")
      return
    }
    setEmployee(JSON.parse(data))
    
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("employee")
    localStorage.removeItem("userType")
    router.push("/employee-login")
  }

  if (!employee) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Animated Background Blobs */}
      <div style={styles.backgroundBlobs}>
        <div style={styles.blob1}></div>
        <div style={styles.blob2}></div>
        <div style={styles.blob3}></div>
      </div>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <div style={styles.logo}>
              <div style={styles.logoInner}>E</div>
            </div>
            <div>
              <h1 style={styles.headerTitle}>Employee Portal</h1>
              <p style={styles.headerTime}>{currentTime}</p>
            </div>
          </div>
          
          <div style={styles.headerRight}>
            <div style={styles.userInfo}>
              <p style={styles.userName}>{employee.first_name} {employee.last_name}</p>
              <p style={styles.userRole}>{employee.position}</p>
            </div>
            
            <div style={styles.profileDropdown}>
              <div style={styles.profileAvatar}>
                {employee.first_name[0]}
              </div>
              <div style={styles.dropdownMenu}>
                <button
                  onClick={handleLogout}
                  style={styles.logoutButton}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Welcome Banner */}
        <div style={styles.welcomeSection}>
          <div style={styles.welcomeCard}>
            <div>
              <h1 style={styles.welcomeTitle}>Welcome back, {employee.first_name}!</h1>
              <p style={styles.welcomeSubtitle}>Ready to conquer your day? You have 3 tasks waiting.</p>
            </div>
            <div style={styles.timeSection}>
              <div style={styles.currentTime}>{currentTime}</div>
              <div style={styles.currentDate}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.contentGrid}>
          {/* Sidebar */}
          <div style={styles.sidebar}>
            {/* Employee Card */}
            <div style={styles.employeeCard}>
              <div style={styles.employeeHeader}>
                <div style={styles.employeeAvatar}>
                  {employee.first_name[0]}{employee.last_name[0]}
                </div>
                <div style={styles.employeeInfo}>
                  <h2 style={styles.employeeName}>{employee.first_name} {employee.last_name}</h2>
                  <p style={styles.employeePosition}>{employee.position}</p>
                </div>
              </div>

              <div style={styles.infoList}>
                <InfoItem label="Employee ID" value={employee.employee_id} />
                <InfoItem label="Email" value={employee.email} />
                <InfoItem label="Department" value={`Department ${employee.department_id}`} />
                <InfoItem label="Member Since" value={new Date(employee.hire_date).toLocaleDateString()} />
              </div>
            </div>

            {/* Stats Card */}
            <div style={styles.statsCard}>
              <h3 style={styles.statsTitle}>Quick Stats</h3>
              <div style={styles.statsList}>
                <StatItem label="Completed Tasks" value="12" />
                <StatItem label="Pending Tasks" value="3" />
                <StatItem label="Projects" value="5" />
                <StatItem label="Team Members" value="8" />
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div style={styles.tasksSection}>
            <div style={styles.tasksCard}>
              <div style={styles.tasksHeader}>
                <div>
                  <h2 style={styles.tasksTitle}>Your Tasks</h2>
                  <p style={styles.tasksSubtitle}>Manage your current assignments</p>
                </div>
                <button style={styles.newTaskButton}>
                  New Task
                </button>
              </div>

              <div style={styles.tasksList}>
                <TaskCard
                  title="Complete Project Documentation"
                  description="Write comprehensive documentation for the current project including API endpoints and user guides. Ensure all technical specifications are covered."
                  dueDate="2024-10-20"
                  priority="high"
                  status="in-progress"
                  progress={65}
                />
                <TaskCard
                  title="Team Meeting Preparation"
                  description="Prepare agenda and presentation materials for the upcoming quarterly team meeting. Coordinate with team leads for updates."
                  dueDate="2024-10-18"
                  priority="medium"
                  status="pending"
                  progress={30}
                />
                <TaskCard
                  title="Code Review Session"
                  description="Review pull requests from the development team. Focus on code quality, security, and performance improvements."
                  dueDate="2024-10-25"
                  priority="medium"
                  status="pending"
                  progress={0}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.infoItem}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.statItem}>
      <span style={styles.statLabel}>{label}</span>
      <span style={styles.statValue}>{value}</span>
    </div>
  )
}

function TaskCard({ 
  title, 
  description, 
  dueDate, 
  priority, 
  status,
  progress 
}: { 
  title: string
  description: string
  dueDate: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed"
  progress: number
}) {
  const priorityStyles = {
    low: styles.priorityLow,
    medium: styles.priorityMedium,
    high: styles.priorityHigh
  }

  const statusStyles = {
    pending: styles.statusPending,
    "in-progress": styles.statusInProgress,
    completed: styles.statusCompleted
  }

  return (
    <div style={styles.taskCard}>
      <div style={styles.taskHeader}>
        <div style={styles.taskContent}>
          <h3 style={styles.taskTitle}>{title}</h3>
          <p style={styles.taskDescription}>{description}</p>
        </div>
        <div style={styles.taskBadges}>
          <span style={{...styles.badge, ...priorityStyles[priority]}}>
            {priority} priority
          </span>
          <span style={{...styles.badge, ...statusStyles[status]}}>
            {status.replace("-", " ")}
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div style={styles.progressSection}>
        <div style={styles.progressLabels}>
          <span style={styles.progressLabel}>Progress</span>
          <span style={styles.progressPercent}>{progress}%</span>
        </div>
        <div style={styles.progressBar}>
          <div 
            style={{
              ...styles.progressFill,
              width: `${progress}%`
            }}
          ></div>
        </div>
      </div>
      
      <div style={styles.taskFooter}>
        <div style={styles.dueDate}>
          Due: {new Date(dueDate).toLocaleDateString()}
        </div>
        <button style={styles.detailsButton}>
          View Details
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    color: 'white',
    position: 'relative' as const,
    overflow: 'hidden'
  },

  backgroundBlobs: {
    position: 'absolute' as const,
    inset: 0,
    overflow: 'hidden',
    opacity: 0.2
  },

  blob1: {
    position: 'absolute' as const,
    top: '20%',
    left: '10%',
    width: '400px',
    height: '400px',
    background: 'linear-gradient(45deg, #10b981, #06b6d4)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    animation: 'float 8s ease-in-out infinite'
  },

  blob2: {
    position: 'absolute' as const,
    top: '60%',
    right: '10%',
    width: '300px',
    height: '300px',
    background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    animation: 'float 6s ease-in-out infinite 2s'
  },

  blob3: {
    position: 'absolute' as const,
    bottom: '20%',
    left: '50%',
    width: '350px',
    height: '350px',
    background: 'linear-gradient(45deg, #f59e0b, #ef4444)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    animation: 'float 10s ease-in-out infinite 1s'
  },

  header: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative' as const,
    zIndex: 10
  },

  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },

  logo: {
    background: 'linear-gradient(45deg, #10b981, #06b6d4)',
    padding: '2px',
    borderRadius: '16px'
  },

  logoInner: {
    background: '#0f172a',
    width: '40px',
    height: '40px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#10b981'
  },

  headerTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
    background: 'linear-gradient(45deg, #fff, #cbd5e1)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },

  headerTime: {
    margin: 0,
    color: '#cbd5e1',
    fontSize: '0.875rem'
  },

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },

  userInfo: {
    textAlign: 'right' as const
  },

  userName: {
    margin: 0,
    fontWeight: '600',
    fontSize: '1rem'
  },

  userRole: {
    margin: 0,
    color: '#94a3b8',
    fontSize: '0.875rem'
  },

  profileDropdown: {
    position: 'relative' as const
  },

  profileAvatar: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(45deg, #10b981, #06b6d4)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.125rem',
    color: '#0f172a',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'scale(1.1)'
    }
  },

  dropdownMenu: {
    position: 'absolute' as const,
    top: '100%',
    right: 0,
    marginTop: '0.5rem',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '0.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    opacity: 0,
    visibility: 'hidden' as const,
    transform: 'translateY(-10px)',
    transition: 'all 0.3s ease'
  },

  logoutButton: {
    background: 'none',
    border: 'none',
    padding: '0.75rem 1rem',
    color: '#374151',
    cursor: 'pointer',
    borderRadius: '8px',
    fontWeight: '500',
    width: '100%',
    textAlign: 'left' as const,
    ':hover': {
      background: '#fef2f2',
      color: '#dc2626'
    }
  },

  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    position: 'relative' as const,
    zIndex: 10
  },

  welcomeSection: {
    marginBottom: '2rem'
  },

  welcomeCard: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  welcomeTitle: {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0',
    background: 'linear-gradient(45deg, #fff, #cbd5e1)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },

  welcomeSubtitle: {
    fontSize: '1.125rem',
    color: '#cbd5e1',
    margin: 0
  },

  timeSection: {
    textAlign: 'right' as const
  },

  currentTime: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#06b6d4',
    margin: '0 0 0.25rem 0',
    fontFamily: 'monospace'
  },

  currentDate: {
    color: '#94a3b8',
    fontSize: '0.875rem'
  },

  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '2rem',
    alignItems: 'start'
  },

  sidebar: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem'
  },

  employeeCard: {
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '1.5rem',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
  },

  employeeHeader: {
    textAlign: 'center' as const,
    marginBottom: '1.5rem'
  },

  employeeAvatar: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(45deg, #10b981, #06b6d4)',
    borderRadius: '20px',
    margin: '0 auto 1rem auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: '#0f172a'
  },

  employeeInfo: {
    textAlign: 'center' as const,
    marginTop: '0.25rem'
  },

  employeeName: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    margin: '0 0 0.25rem 0'
  },

  employeePosition: {
    color: '#cbd5e1',
    margin: 0,
    fontSize: '0.875rem'
  },

  infoList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem'
  },

  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    ':last-child': {
      borderBottom: 'none'
    }
  },

  infoLabel: {
    color: '#cbd5e1',
    fontSize: '0.875rem',
    fontWeight: '500'
  },

  infoValue: {
    fontSize: '0.875rem',
    fontWeight: '600'
  },

  statsCard: {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '1.5rem',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
  },

  statsTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    margin: '0 0 1rem 0'
  },

  statsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem'
  },

  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  statLabel: {
    color: '#cbd5e1',
    fontSize: '0.875rem'
  },

  statValue: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#06b6d4'
  },

  tasksSection: {
    minWidth: 0
  },

  tasksCard: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  },

  tasksHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem'
  },

  tasksTitle: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0'
  },

  tasksSubtitle: {
    color: '#cbd5e1',
    margin: 0,
    fontSize: '1rem'
  },

  newTaskButton: {
    background: 'linear-gradient(45deg, #10b981, #06b6d4)',
    border: 'none',
    padding: '0.75rem 1.5rem',
    color: 'white',
    fontWeight: '600',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 15px rgba(16, 185, 129, 0.4)'
    }
  },

  tasksList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem'
  },

  taskCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    ':hover': {
      borderColor: 'rgba(16, 185, 129, 0.3)',
      transform: 'scale(1.02)',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
    }
  },

  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    gap: '1rem'
  },

  taskContent: {
    flex: 1
  },

  taskTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: '0 0 0.5rem 0',
    transition: 'color 0.3s ease'
  },

  taskDescription: {
    color: '#cbd5e1',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    margin: 0
  },

  taskBadges: {
    display: 'flex',
    gap: '0.5rem',
    flexShrink: 0
  },

  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    border: '1px solid'
  },

  priorityLow: {
    background: 'rgba(34, 197, 94, 0.2)',
    color: '#4ade80',
    borderColor: 'rgba(34, 197, 94, 0.3)'
  },

  priorityMedium: {
    background: 'rgba(234, 179, 8, 0.2)',
    color: '#facc15',
    borderColor: 'rgba(234, 179, 8, 0.3)'
  },

  priorityHigh: {
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },

  statusPending: {
    background: 'rgba(156, 163, 175, 0.2)',
    color: '#d1d5db',
    borderColor: 'rgba(156, 163, 175, 0.3)'
  },

  statusInProgress: {
    background: 'rgba(59, 130, 246, 0.2)',
    color: '#60a5fa',
    borderColor: 'rgba(59, 130, 246, 0.3)'
  },

  statusCompleted: {
    background: 'rgba(16, 185, 129, 0.2)',
    color: '#34d399',
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },

  progressSection: {
    marginBottom: '1rem'
  },

  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },

  progressLabel: {
    fontSize: '0.875rem',
    color: '#cbd5e1'
  },

  progressPercent: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#06b6d4'
  },

  progressBar: {
    width: '100%',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    overflow: 'hidden'
  },

  progressFill: {
    height: '100%',
    background: 'linear-gradient(45deg, #10b981, #06b6d4)',
    borderRadius: '10px',
    transition: 'width 0.5s ease'
  },

  taskFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  dueDate: {
    fontSize: '0.875rem',
    color: '#cbd5e1'
  },

  detailsButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '0.5rem 1rem',
    color: 'white',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.2)',
      transform: 'scale(1.05)'
    }
  },

  loadingContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },

  spinner: {
    width: '60px',
    height: '60px',
    border: '4px solid rgba(255, 255, 255, 0.1)',
    borderTop: '4px solid #10b981',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  },

  loadingText: {
    fontSize: '1.125rem',
    color: '#cbd5e1'
  }
} as const

// Add CSS animations
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

// Add hover effects for interactive elements
styleSheet.insertRule(`
  .profile-dropdown:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`, styleSheet.cssRules.length);