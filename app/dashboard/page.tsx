// app/dashboard/page.tsx - Complete with sidebar navigation
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Employee {
  id: number
  name: string
  email: string
  department: string
  position: string
  salary: number
  joinDate: string
}

interface Department {
  id: number
  name: string
  manager: string
  employeeCount: number
}

interface Attendance {
  id: number
  employeeId: number
  employeeName: string
  date: string
  checkIn: string
  checkOut: string
  status: string
  department: string
}

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

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("overview")
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    salary: "",
    joinDate: ""
  })

  // Fetch real data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employees
        const employeesResponse = await fetch('/api/employees')
        const employeesData = await employeesResponse.json()
        setEmployees(Array.isArray(employeesData) ? employeesData.map(emp => ({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          department: emp.department_name || 'Unknown',
          position: emp.designation || 'Staff',
          salary: emp.salary || 0,
          joinDate: emp.created_at ? new Date(emp.created_at).toISOString().split('T')[0] : '2023-01-01'
        })) : [])

        // Fetch departments
        const departmentsResponse = await fetch('/api/departments')
        const departmentsData = await departmentsResponse.json()
        setDepartments(Array.isArray(departmentsData) ? departmentsData.map(dept => ({
          id: dept.id,
          name: dept.name,
          manager: 'Manager', // You might want to add manager field to departments table
          employeeCount: employeesData ? employeesData.filter(emp => emp.department_id === dept.id).length : 0
        })) : [])

        // Fetch tasks
        const tasksResponse = await fetch('/api/tasks')
        const tasksData = await tasksResponse.json()
        setTasks(Array.isArray(tasksData) ? tasksData : [])

        // Mock attendance data for now (you can create an attendance API later)
        setAttendance([
          { id: 1, employeeId: 1, employeeName: "John Dan", date: "2024-01-15", checkIn: "08:15", checkOut: "17:30", status: "Present", department: "IT" },
          { id: 2, employeeId: 2, employeeName: "Jane hildah", date: "2024-01-15", checkIn: "08:45", checkOut: "17:15", status: "Late", department: "HR" },
          { id: 3, employeeId: 3, employeeName: "Mikel Johnson", date: "2024-01-15", checkIn: "09:00", checkOut: "17:45", status: "Late", department: "Finance" },
          { id: 4, employeeId: 4, employeeName: "Sarah Willian", date: "2024-01-15", checkIn: "08:30", checkOut: "17:00", status: "Present", department: "IT" }
        ])

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = () => {
    document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push("/login")
  }

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault()
    const employee: Employee = {
      id: employees.length + 1,
      name: newEmployee.name,
      email: newEmployee.email,
      department: newEmployee.department,
      position: newEmployee.position,
      salary: parseInt(newEmployee.salary),
      joinDate: newEmployee.joinDate
    }
    
    setEmployees([...employees, employee])
    setShowAddEmployee(false)
    setNewEmployee({ name: "", email: "", department: "", position: "", salary: "", joinDate: "" })
  }

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id))
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Present":
        return { backgroundColor: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: "20px", fontSize: "14px", fontWeight: "600" }
      case "Late":
        return { backgroundColor: "#fef9c3", color: "#854d0e", padding: "4px 12px", borderRadius: "20px", fontSize: "14px", fontWeight: "600" }
      case "Absent":
        return { backgroundColor: "#fee2e2", color: "#991b1b", padding: "4px 12px", borderRadius: "20px", fontSize: "14px", fontWeight: "600" }
      default:
        return { backgroundColor: "#e5e7eb", color: "#374151", padding: "4px 12px", borderRadius: "20px", fontSize: "14px", fontWeight: "600" }
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
        <div style={{ fontSize: '1.25rem', color: '#6b7280' }}>Loading dashboard...</div>
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
              Employee Management Dashboard
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
          {/* Overview Section */}
          {activeSection === "overview" && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>
                Welcome to Dashboard
              </h2>
              
              {/* Stats Cards */}
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
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>Total Employees</h3>
                    <span style={{ fontSize: '1.5rem' }}>👥</span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                    {employees.length}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>+5 from last month</div>
                </div>

                <div style={{ 
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>Present Today</h3>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                    {attendance.filter(a => a.status === "Present").length}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {attendance.filter(a => a.status !== "Present").length} absent today
                  </div>
                </div>

                <div style={{ 
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>Departments</h3>
                    <span style={{ fontSize: '1.5rem' }}>🏢</span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                    {departments.length}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active departments</div>
                </div>

                <div style={{ 
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>Active Tasks</h3>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                    {tasks.filter(task => task.status === 'in_progress').length}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {tasks.filter(task => task.status === 'todo').length} pending, {tasks.filter(task => task.status === 'completed').length} completed
                  </div>
                </div>
              </div>

              {/* Task Overview */}
              <div style={{ 
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                  Task Overview
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#374151' }}>
                      {tasks.filter(task => task.status === 'todo').length}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>To Do</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af' }}>
                      {tasks.filter(task => task.status === 'in_progress').length}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#1e40af' }}>In Progress</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#dcfce7', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#166534' }}>
                      {tasks.filter(task => task.status === 'completed').length}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#166534' }}>Completed</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#92400e' }}>
                      {tasks.filter(task => task.priority === 'high').length}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#92400e' }}>High Priority</div>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div style={{ 
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                  Recent Task Activities
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Task</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Assigned To</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Status</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.slice(0, 5).map((task) => (
                        <tr key={task.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: '600', color: '#111827' }}>{task.title}</div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              {task.description ? (task.description.length > 50 ? task.description.substring(0, 50) + '...' : task.description) : 'No description'}
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>{task.assigned_to_name || 'Unassigned'}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              backgroundColor: task.status === 'completed' ? '#dcfce7' : 
                                             task.status === 'in_progress' ? '#dbeafe' : '#f3f4f6',
                              color: task.status === 'completed' ? '#166534' : 
                                     task.status === 'in_progress' ? '#1e40af' : '#374151',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              backgroundColor: task.priority === 'high' ? '#fee2e2' : 
                                             task.priority === 'medium' ? '#fef9c3' : '#dcfce7',
                              color: task.priority === 'high' ? '#991b1b' : 
                                     task.priority === 'medium' ? '#854d0e' : '#166534',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {task.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Section */}
          {activeSection === "attendance" && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>
                Attendance Management
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <input 
                  type="date" 
                  style={{ 
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  defaultValue="2024-01-15"
                />
              </div>

              <div style={{ 
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Employee ID</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Department</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Check In</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Check Out</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((record) => (
                        <tr key={record.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px' }}>EMP{record.employeeId}</td>
                          <td style={{ padding: '12px' }}>{record.employeeName}</td>
                          <td style={{ padding: '12px' }}>{record.department}</td>
                          <td style={{ padding: '12px' }}>{record.checkIn}</td>
                          <td style={{ padding: '12px' }}>{record.checkOut}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={getStatusStyle(record.status)}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Employees Section */}
          {activeSection === "employees" && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>
                  Employee Management
                </h2>
                <button
                  onClick={() => setShowAddEmployee(true)}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  + Add Employee
                </button>
              </div>

              {/* Add Employee Modal */}
              {showAddEmployee && (
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
                    maxWidth: '500px'
                  }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Add New Employee</h3>
                    <form onSubmit={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                        style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '14px'
                        }}
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                        style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '14px'
                        }}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Department"
                        value={newEmployee.department}
                        onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                        style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '14px'
                        }}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Position"
                        value={newEmployee.position}
                        onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                        style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '14px'
                        }}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Salary"
                        value={newEmployee.salary}
                        onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                        style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '14px'
                        }}
                        required
                      />
                      <input
                        type="date"
                        placeholder="Join Date"
                        value={newEmployee.joinDate}
                        onChange={(e) => setNewEmployee({...newEmployee, joinDate: e.target.value})}
                        style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '14px'
                        }}
                        required
                      />
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
                          Add Employee
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddEmployee(false)}
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

              <div style={{ 
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>ID</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Department</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Position</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Email</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Salary</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee) => (
                        <tr key={employee.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px' }}>EMP{employee.id}</td>
                          <td style={{ padding: '12px' }}>{employee.name}</td>
                          <td style={{ padding: '12px' }}>{employee.department}</td>
                          <td style={{ padding: '12px' }}>{employee.position}</td>
                          <td style={{ padding: '12px' }}>{employee.email}</td>
                          <td style={{ padding: '12px' }}>${employee.salary.toLocaleString()}</td>
                          <td style={{ padding: '12px' }}>
                            <button
                              onClick={() => handleDeleteEmployee(employee.id)}
                              style={{
                                backgroundColor: '#ef4444',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Departments Section */}
          {activeSection === "departments" && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>
                Department Management
              </h2>
              
              <div style={{ 
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Department ID</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Department Name</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Head of Department</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>No. of Employees</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map((dept) => (
                        <tr key={dept.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px' }}>DEPT{dept.id}</td>
                          <td style={{ padding: '12px' }}>{dept.name}</td>
                          <td style={{ padding: '12px' }}>{dept.manager}</td>
                          <td style={{ padding: '12px' }}>{dept.employeeCount}</td>
                          <td style={{ padding: '12px' }}>
                            <button style={{
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '6px',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600',
                              marginRight: '8px'
                            }}>
                              Edit
                            </button>
                            <button style={{
                              backgroundColor: '#ef4444',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '6px',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Other Sections */}
          {activeSection === "leaves" && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>
                Leave Management
              </h2>
              <div style={{ 
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <p style={{ color: '#6b7280' }}>Leave management content will be implemented here</p>
              </div>
            </div>
          )}

          {activeSection === "salary" && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>
                Salary Management
              </h2>
              <div style={{ 
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <p style={{ color: '#6b7280' }}>Salary management content will be implemented here</p>
              </div>
            </div>
          )}

          {activeSection === "settings" && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>
                System Settings
              </h2>
              <div style={{ 
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <p style={{ color: '#6b7280' }}>System settings content will be implemented here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}