"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Task {
  id: number
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date: string
  created_by: number
  assigned_to: number
  created_by_name: string
  assigned_to_name: string
  department_name: string
  created_at: string
}

export default function EmployeesDashboard() {
  const router = useRouter()
  const [employee, setEmployee] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState("")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskDetails, setShowTaskDetails] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem("employee")
    const userType = localStorage.getItem("userType")
    
    if (!data || userType !== 'employee') {
      router.push("/dashboard/employees/login")
      return
    }
    
    const employeeData = JSON.parse(data)
    setEmployee(employeeData)
    fetchEmployeeTasks(employeeData.id)
    
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    
    return () => {
      clearInterval(interval)
    }
  }, [router])

  const fetchEmployeeTasks = async (employeeId: number) => {
    try {
      const response = await fetch('/api/tasks')
      const allTasks = await response.json()
      // Filter tasks assigned to current employee
      const employeeTasks = Array.isArray(allTasks) ? allTasks.filter((task: Task) => task.assigned_to === employeeId) : []
      setTasks(employeeTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    console.log('Logout clicked') // Debug log
    localStorage.removeItem("employee")
    localStorage.removeItem("userType")
    router.push("/dashboard/employees/login")
  }

  const handleTaskDetails = (task: Task) => {
    setSelectedTask(task)
    setShowTaskDetails(true)
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
              <p style={styles.userName}>{employee.name || `${employee.first_name || ''} ${employee.last_name || ''}`}</p>
              <p style={styles.userRole}>{employee.position || 'Employee'}</p>
            </div>
            
            <div style={styles.profileAvatar}>
              {(employee.name?.[0] || employee.first_name?.[0] || 'E').toUpperCase()}
            </div>
            
            <button
              onClick={handleLogout}
              style={styles.logoutButtonNav}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Welcome Banner */}
        <div style={styles.welcomeSection}>
          <div style={styles.welcomeCard}>
            <div>
              <h1 style={styles.welcomeTitle}>Welcome back, {employee.name || employee.first_name || 'Employee'}!</h1>
              <p style={styles.welcomeSubtitle}>Ready to conquer your day? You have {Array.isArray(tasks) ? tasks.filter(task => task.status === 'todo').length : 0} tasks waiting.</p>
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
                  {(employee.name?.[0] || employee.first_name?.[0] || 'E').toUpperCase()}{(employee.name?.[1] || employee.last_name?.[0] || 'M').toUpperCase()}
                </div>
                <div style={styles.employeeInfo}>
                  <h2 style={styles.employeeName}>{employee.name || `${employee.first_name || ''} ${employee.last_name || ''}`}</h2>
                  <p style={styles.employeePosition}>{employee.position || 'Employee'}</p>
                </div>
              </div>

              <div style={styles.infoList}>
                <InfoItem label="Employee ID" value={employee.id?.toString() || 'N/A'} />
                <InfoItem label="Email" value={employee.email || 'N/A'} />
                <InfoItem label="Department" value={employee.department_id ? `Department ${employee.department_id}` : 'N/A'} />
                <InfoItem label="Member Since" value={employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : 'N/A'} />
              </div>
            </div>

            {/* Stats Card */}
            <div style={styles.statsCard}>
              <h3 style={styles.statsTitle}>Quick Stats</h3>
              <div style={styles.statsList}>
                <StatItem label="Completed Tasks" value={Array.isArray(tasks) ? tasks.filter(task => task.status === 'completed').length.toString() : "0"} />
                <StatItem label="Pending Tasks" value={Array.isArray(tasks) ? tasks.filter(task => task.status === 'todo').length.toString() : "0"} />
                <StatItem label="In Progress" value={Array.isArray(tasks) ? tasks.filter(task => task.status === 'in_progress').length.toString() : "0"} />
                <StatItem label="Total Tasks" value={Array.isArray(tasks) ? tasks.length.toString() : "0"} />
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
                {Array.isArray(tasks) && tasks.length > 0 ? (
                  tasks.slice(0, 3).map((task) => (
                    <TaskCard
                      key={task.id}
                      title={task.title}
                      description={task.description || 'No description provided'}
                      dueDate={task.due_date}
                      priority={task.priority}
                      status={task.status === 'todo' ? 'pending' : task.status === 'in_progress' ? 'in-progress' : 'completed'}
                      progress={task.status === 'completed' ? 100 : task.status === 'in_progress' ? 65 : 0}
                      onViewDetails={() => handleTaskDetails(task)}
                    />
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#cbd5e1' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                    <p style={{ margin: 0 }}>No tasks assigned yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Task Details Modal */}
      {showTaskDetails && selectedTask && (
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            color: '#111827'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              {selectedTask.title}
            </h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{
                  backgroundColor: selectedTask.priority === 'high' ? '#fee2e2' : 
                                 selectedTask.priority === 'medium' ? '#fef9c3' : '#dcfce7',
                  color: selectedTask.priority === 'high' ? '#991b1b' : 
                         selectedTask.priority === 'medium' ? '#854d0e' : '#166534',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {selectedTask.priority} priority
                </span>
                <span style={{
                  backgroundColor: selectedTask.status === 'completed' ? '#dcfce7' : 
                                 selectedTask.status === 'in_progress' ? '#dbeafe' : '#f3f4f6',
                  color: selectedTask.status === 'completed' ? '#166534' : 
                         selectedTask.status === 'in_progress' ? '#1e40af' : '#374151',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {selectedTask.status.replace('_', ' ')}
                </span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Description</h4>
                <p style={{ color: '#6b7280', margin: 0 }}>{selectedTask.description || 'No description provided'}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>Due Date</h4>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {new Date(selectedTask.due_date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>Department</h4>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {selectedTask.department_name || 'Not specified'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowTaskDetails(false)}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  flex: 1
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
  progress,
  onViewDetails
}: { 
  title: string
  description: string
  dueDate: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed"
  progress: number
  onViewDetails: () => void
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
        <button 
          style={styles.detailsButton}
          onClick={onViewDetails}
        >
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
    position: 'relative' as const,
    zIndex: 1001
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
    transition: 'transform 0.2s ease'
  },

  logoutButtonNav: {
    background: '#ef4444',
    border: 'none',
    padding: '0.5rem 1rem',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    ':hover': {
      background: '#dc2626',
      transform: 'scale(1.05)'
    },
    ':active': {
      background: '#b91c1c',
      transform: 'scale(0.95)'
    }
  },

  dropdownMenu: {
    position: 'absolute' as const,
    top: '100%',
    right: 0,
    marginTop: '0.5rem',
    background: 'white',
    borderRadius: '16px',
    padding: '0.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    border: '2px solid #e5e7eb',
    opacity: 1,
    visibility: 'visible' as const,
    transform: 'translateY(0)',
    transition: 'all 0.3s ease',
    zIndex: 1000,
    minWidth: '120px'
  },

  logoutButton: {
    background: '#ef4444',
    border: 'none',
    padding: '0.75rem 1rem',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '8px',
    fontWeight: '600',
    width: '100%',
    textAlign: 'left' as const,
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    display: 'block',
    ':hover': {
      background: '#dc2626',
      transform: 'scale(1.02)'
    },
    ':active': {
      background: '#b91c1c',
      transform: 'scale(0.98)'
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