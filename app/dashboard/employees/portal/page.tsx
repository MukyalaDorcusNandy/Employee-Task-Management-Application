"use client"

import { useState, useEffect } from "react"
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

interface TaskComment {
  id: number
  comment: string
  employee_name: string
  created_at: string
}

export default function EmployeePortal() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [taskComments, setTaskComments] = useState<TaskComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [employeeId, setEmployeeId] = useState<number | null>(null)
  const [employeeName, setEmployeeName] = useState("")

  useEffect(() => {
    // Get employee data from localStorage
    const employeeData = localStorage.getItem('employee')
    const userType = localStorage.getItem('userType')
    
    if (employeeData && userType === 'employee') {
      const employee = JSON.parse(employeeData)
      setEmployeeId(employee.id)
      setEmployeeName(employee.name)
      fetchEmployeeTasks(employee.id)
    } else {
      // Redirect to login if not authenticated
      router.push('/dashboard/employees/login')
    }
  }, [router])

  const fetchEmployeeTasks = async (empId: number) => {
    try {
      const response = await fetch('/api/tasks')
      const allTasks = await response.json()
      // Filter tasks assigned to current employee
      const employeeTasks = Array.isArray(allTasks) ? allTasks.filter((task: Task) => task.assigned_to === empId) : []
      setTasks(employeeTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const fetchTaskComments = async (taskId: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/comments`)
      const comments = await response.json()
      setTaskComments(Array.isArray(comments) ? comments : [])
    } catch (error) {
      console.error('Error fetching comments:', error)
      setTaskComments([])
    }
  }

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      })
      
      if (response.ok) {
        fetchEmployeeTasks(employeeId!)
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const handleAddComment = async () => {
    if (!selectedTask || !newComment.trim() || !employeeId) return

    try {
      const response = await fetch(`/api/tasks/${selectedTask.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: newComment,
          employee_id: employeeId
        }),
      })
      
      if (response.ok) {
        setNewComment("")
        fetchTaskComments(selectedTask.id)
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task)
    setShowTaskDetails(true)
    fetchTaskComments(task.id)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return { backgroundColor: '#fee2e2', color: '#991b1b', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }
      case 'medium':
        return { backgroundColor: '#fef9c3', color: '#854d0e', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }
      case 'low':
        return { backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }
      default:
        return { backgroundColor: '#e5e7eb', color: '#374151', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }
    }
  }

  const todoTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'todo') : []
  const inProgressTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'in_progress') : []
  const completedTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'completed') : []

  const handleLogout = () => {
    localStorage.removeItem('employee')
    localStorage.removeItem('userType')
    router.push('/dashboard/employees/login')
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
        <div style={{ fontSize: '1.25rem', color: '#6b7280' }}>Loading your tasks...</div>
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Employee Portal</h2>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Task Management</p>
        </div>
        
        <div style={{ padding: '1rem', borderTop: '1px solid #374151', marginTop: 'auto' }}>
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#374151', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Logged in as:</div>
            <div style={{ fontSize: '1rem', fontWeight: '600', color: 'white' }}>{employeeName}</div>
          </div>
          
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
                My Tasks
              </h1>
              <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                Welcome back, {employeeName}! Manage your assigned tasks and track progress.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{ padding: '2rem' }}>
          {/* Task Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{ 
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>To Do</h3>
                <span style={{ fontSize: '1.5rem' }}>⭕</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                {todoTasks.length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tasks pending</div>
            </div>

            <div style={{ 
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>In Progress</h3>
                <span style={{ fontSize: '1.5rem' }}>🔄</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                {inProgressTasks.length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active tasks</div>
            </div>

            <div style={{ 
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>Completed</h3>
                <span style={{ fontSize: '1.5rem' }}>✅</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                {completedTasks.length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tasks finished</div>
            </div>
          </div>

          {/* Task Lists */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* To Do */}
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                To Do ({todoTasks.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {todoTasks.map((task) => (
                  <div key={task.id} style={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}
                  onClick={() => openTaskDetails(task)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{task.title}</h3>
                      <span style={getPriorityColor(task.priority)}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '0.75rem', margin: 0 }}>
                        {task.description.length > 100 ? task.description.substring(0, 100) + '...' : task.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStatusChange(task.id, 'in_progress')
                        }}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
                {todoTasks.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭕</div>
                    <p style={{ fontSize: '14px', margin: 0 }}>No tasks to do</p>
                  </div>
                )}
              </div>
            </div>

            {/* In Progress */}
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                In Progress ({inProgressTasks.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {inProgressTasks.map((task) => (
                  <div key={task.id} style={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}
                  onClick={() => openTaskDetails(task)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{task.title}</h3>
                      <span style={getPriorityColor(task.priority)}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '0.75rem', margin: 0 }}>
                        {task.description.length > 100 ? task.description.substring(0, 100) + '...' : task.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStatusChange(task.id, 'completed')
                        }}
                        style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
                {inProgressTasks.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄</div>
                    <p style={{ fontSize: '14px', margin: 0 }}>No tasks in progress</p>
                  </div>
                )}
              </div>
            </div>

            {/* Completed */}
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Completed ({completedTasks.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {completedTasks.map((task) => (
                  <div key={task.id} style={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    opacity: 0.8
                  }}
                  onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}
                  onClick={() => openTaskDetails(task)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{task.title}</h3>
                      <span style={getPriorityColor(task.priority)}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '0.75rem', margin: 0 }}>
                        {task.description.length > 100 ? task.description.substring(0, 100) + '...' : task.description}
                      </p>
                    )}
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Completed: {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {completedTasks.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                    <p style={{ fontSize: '14px', margin: 0 }}>No completed tasks</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Task Details Modal */}
          {showTaskDetails && (
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
                overflowY: 'auto'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>{selectedTask?.title}</h3>
                
                {selectedTask && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span style={getPriorityColor(selectedTask.priority)}>
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

                    {/* Comments Section */}
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.75rem' }}>Comments</h4>
                      <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
                        {taskComments.length === 0 ? (
                          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>No comments yet</p>
                        ) : (
                          taskComments.map((comment) => (
                            <div key={comment.id} style={{ 
                              backgroundColor: '#f9fafb', 
                              padding: '0.75rem', 
                              borderRadius: '8px', 
                              marginBottom: '0.5rem',
                              border: '1px solid #e5e7eb'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151' }}>{comment.employee_name}</span>
                                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                  {new Date(comment.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p style={{ fontSize: '0.875rem', color: '#111827', margin: 0 }}>{comment.comment}</p>
                            </div>
                          ))
                        )}
                      </div>
                      
                      <div>
                        <textarea
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          style={{
                            width: '100%',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            padding: '0.75rem',
                            fontSize: '0.875rem',
                            outline: 'none',
                            resize: 'vertical',
                            marginBottom: '0.75rem'
                          }}
                          rows={3}
                        />
                        <button 
                          onClick={handleAddComment}
                          style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600'
                          }}
                        >
                          Add Comment
                        </button>
                      </div>
                    </div>
                  </div>
                )}

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
      </div>
    </div>
  )
}