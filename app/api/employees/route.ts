import { type NextRequest, NextResponse } from "next/server"
import { sql, handleDbError } from "@/lib/db"

// GET all employees
export async function GET() {
  try {
    const employees = await sql`
      SELECT 
        e.*,
        d.name as department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      ORDER BY e.created_at DESC
    `

    return NextResponse.json(employees)
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 })
  }
}

// POST create new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      employeeId,
      name,
      email,
      dateOfBirth,
      gender,
      maritalStatus,
      designation,
      departmentId,
      salary,
      role,
      imageUrl,
      password,
    } = body

    if (!employeeId || !name || !email) {
      return NextResponse.json({ error: "Employee ID, name, and email are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO employees (
        employee_id, name, email, date_of_birth, gender, marital_status,
        designation, department_id, salary, role, image_url, password
      )
      VALUES (
        ${employeeId}, ${name}, ${email}, ${dateOfBirth || null}, 
        ${gender || null}, ${maritalStatus || null}, ${designation || null},
        ${departmentId || null}, ${salary || null}, ${role || null},
        ${imageUrl || null}, ${password || "password123"}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 })
  }
}
