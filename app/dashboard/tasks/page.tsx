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
  created_by_name: string
  assigned_to_name: string
  department_name: string
  created_at: string
}

interface Employee {
  id: number
  name: string
  department_id: number
}

interface Department {
  id: number
  name: string
}

export default function TaskManagement() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
    assigned_to: "",
    department_id: ""
  })

  useEffect(() => {
    fetchTasks()
    fetchEmployees()
    fetchDepartments()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      const data = await response.json()
      setTasks(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      const data = await response.json()
      setEmployees(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments')
      const data = await response.json()
      setDepartments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTask,
          created_by: 1,
          assigned_to: newTask.assigned_to ? parseInt(newTask.assigned_to) : null,
          department_id: newTask.department_id ? parseInt(newTask.department_id) : null
        }),
      })
      
      if (response.ok) {
        fetchTasks()
        setShowTaskForm(false)
        setNewTask({ title: "", description: "", priority: "medium", due_date: "", assigned_to: "", department_id: "" })
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleUpdateTask = async (taskData: Omit<Task, 'id'>) => {
    if (!editingTask) return
    
    try {
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })
      
      if (response.ok) {
        fetchTasks()
        setEditingTask(undefined)
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      if (!task) return
      
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          status: newStatus
        }),
      })
      
      if (response.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const filteredTasks = Array.isArray(tasks) ? tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assigned_to_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    const matchesDepartment = filterDepartment === "all" || 
                             (task.department_name && task.department_name.toLowerCase().includes(filterDepartment.toLowerCase()))
    
    return matchesSearch && matchesPriority && matchesDepartment
  }) : []

  const todoTasks = Array.isArray(filteredTasks) ? filteredTasks.filter(task => task.status === 'todo') : []
  const inProgressTasks = Array.isArray(filteredTasks) ? filteredTasks.filter(task => task.status === 'in_progress') : []
  const completedTasks = Array.isArray(filteredTasks) ? filteredTasks.filter(task => task.status === 'completed') : []

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return { backgroundColor: '#f3f4f6', color: '#374151', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }
      case 'in_progress':
        return { backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }
      case 'completed':
        return { backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }
    }
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
        <div style={{ fontSize: '1.25rem', color: '#6b7280' }}>Loading tasks...</div>
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Employee MS</h2>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Management System</p>
        </div>
        
        <nav style={{ padding: '1.5rem 1rem' }}>
          {[
            { id: "overview", label: "Overview", icon: "📊", path: "/dashboard" },
            { id: "attendance", label: "Attendance", icon: "📅", path: "/dashboard/attendance" },
            { id: "employees", label: "Employees", icon: "👥", path: "/dashboard/employees" },
            { id: "departments", label: "Departments", icon: "🏢", path: "/dashboard/departments" },
            { id: "tasks", label: "Tasks", icon: "✅", path: "/dashboard/tasks" },
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
                backgroundColor: item.id === 'tasks' ? '#374151' : 'transparent',
                color: item.id === 'tasks' ? 'white' : '#d1d5db',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (item.id !== 'tasks') {
                  e.currentTarget.style.backgroundColor = '#374151'
                }
              }}
              onMouseOut={(e) => {
                if (item.id !== 'tasks') {
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
            onClick={() => {
              document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
              router.push("/login")
            }}
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
              Task Management
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

        {/* Dashboard Content */}
        <div style={{ padding: '2rem' }}>
          {/* Header Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>
                Task Management Dashboard
              </h2>
              <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Manage and track employee tasks</p>
            </div>
            <button
              onClick={() => setShowTaskForm(true)}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>+</span>
              Create Task
            </button>
          </div>

          {/* Filters */}
          <div style={{ 
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <span style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#6b7280'
                }}>🔍</span>
              </div>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  minWidth: '120px'
                }}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  minWidth: '150px'
                }}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name.toLowerCase()}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Kanban Board */}
          <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
            {/* To Do Column */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>To Do</h3>
                    <div style={{ 
                      backgroundColor: '#6b7280',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {todoTasks.length}
                    </div>
                  </div>
                </div>
                
                <div style={{ padding: '1rem', minHeight: '400px' }}>
                  {todoTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                      <p style={{ fontSize: '14px' }}>No tasks to do</p>
                    </div>
                  ) : (
                    todoTasks.map((task) => (
                      <div key={task.id} style={{ 
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                      onClick={() => setEditingTask(task)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{task.title}</h4>
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
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* In Progress Column */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>In Progress</h3>
                    <div style={{ 
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {inProgressTasks.length}
                    </div>
                  </div>
                </div>
                
                <div style={{ padding: '1rem', minHeight: '400px' }}>
                  {inProgressTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                      <p style={{ fontSize: '14px' }}>No tasks in progress</p>
                    </div>
                  ) : (
                    inProgressTasks.map((task) => (
                      <div key={task.id} style={{ 
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                      onClick={() => setEditingTask(task)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{task.title}</h4>
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
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Completed Column */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>Completed</h3>
                    <div style={{ 
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {completedTasks.length}
                    </div>
                  </div>
                </div>
                
                <div style={{ padding: '1rem', minHeight: '400px' }}>
                  {completedTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                      <p style={{ fontSize: '14px' }}>No completed tasks</p>
                    </div>
                  ) : (
                    completedTasks.map((task) => (
                      <div key={task.id} style={{ 
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        opacity: 0.8
                      }}
                      onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                      onClick={() => setEditingTask(task)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{task.title}</h4>
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
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Task Form Modal */}
          {showTaskForm && (
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
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Create New Task</h3>
                <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Task Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Description
                    </label>
                    <textarea
                      placeholder="Enter task description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      rows={3}
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                        style={{
                          width: '100%',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newTask.due_date}
                        onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                        style={{
                          width: '100%',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                        Department
                      </label>
                      <select
                        value={newTask.department_id}
                        onChange={(e) => setNewTask({...newTask, department_id: e.target.value})}
                        style={{
                          width: '100%',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      >
                        <option value="">Select department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                        Assign To
                      </label>
                      <select
                        value={newTask.assigned_to}
                        onChange={(e) => setNewTask({...newTask, assigned_to: e.target.value})}
                        style={{
                          width: '100%',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      >
                        <option value="">Select employee</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        flex: 1
                      }}
                    >
                      Create Task
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTaskForm(false)}
                      style={{
                        backgroundColor: '#6b7280',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        flex: 1
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}