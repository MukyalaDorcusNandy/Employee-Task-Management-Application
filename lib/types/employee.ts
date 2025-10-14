// Employee Management System Types

export interface Admin {
  id: number
  email: string
  name: string
  createdAt: string
}

export interface Department {
  id: number
  name: string
  description?: string
  createdAt: string
}

export interface Employee {
  id: number
  employeeId: string
  name: string
  email: string
  dateOfBirth?: string
  gender?: string
  maritalStatus?: string
  designation?: string
  departmentId?: number
  department?: Department
  salary?: number
  role?: string
  imageUrl?: string
  createdAt: string
}

export interface LeaveRequest {
  id: number
  employeeId: number
  employee?: Employee
  leaveType: string
  startDate: string
  endDate: string
  reason?: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
}

export interface Attendance {
  id: number
  employeeId: number
  employee?: Employee
  date: string
  checkIn?: string
  checkOut?: string
  status: "present" | "absent" | "late"
  createdAt: string
}

export interface SalaryPayment {
  id: number
  employeeId: number
  employee?: Employee
  amount: number
  paymentDate: string
  month: string
  year: number
  status: "pending" | "paid"
  createdAt: string
}

export interface DashboardStats {
  totalEmployees: number
  totalDepartments: number
  monthlyPay: number
  leaveApplied: number
  leaveApproved: number
  leavePending: number
  leaveRejected: number
}
