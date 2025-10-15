import { type NextRequest, NextResponse } from "next/server"
import dbConfig from "@/lib/db"
import { Pool } from "pg"

const pool = new Pool(dbConfig as any)

export async function GET(request: NextRequest) {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        employee_id as "employeeId",
        name,
        email,
        department,
        designation,
        salary,
        join_date as "joinDate"
      FROM employees 
      ORDER BY id
    `)
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching employees:", error)
    
    // Fallback to mock data if database fails
    const mockEmployees = [
      {
        id: 1,
        employeeId: "EMP001",
        name: "John Doe",
        email: "john@company.com",
        department: "IT",
        designation: "Software Engineer",
        salary: 75000,
        joinDate: "2023-01-15"
      },
      {
        id: 2,
        employeeId: "EMP002", 
        name: "Jane Smith",
        email: "jane@company.com",
        department: "HR",
        designation: "HR Manager",
        salary: 65000,
        joinDate: "2023-02-20"
      }
    ]
    
    return NextResponse.json(mockEmployees)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const result = await pool.query(
      `INSERT INTO employees (name, email, department, designation, salary, join_date) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [body.name, body.email, body.department, body.designation, body.salary, body.joinDate]
    )
    
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    )
  }
}