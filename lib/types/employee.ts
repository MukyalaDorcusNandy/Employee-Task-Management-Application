export interface Department {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Employee {
  id: number
  employee_id: string
  first_name: string
  last_name: string
  email: string
  department_id: number
  position: string
  hire_date: string
  salary: number
  created_at: string
}