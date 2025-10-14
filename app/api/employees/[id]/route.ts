import { type NextRequest, NextResponse } from "next/server"
import { sql, handleDbError } from "@/lib/db"

// GET single employee
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await sql`
      SELECT 
        e.*,
        d.name as department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.id = ${params.id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 })
  }
}

// PUT update employee
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    } = body

    const result = await sql`
      UPDATE employees
      SET 
        employee_id = ${employeeId},
        name = ${name},
        email = ${email},
        date_of_birth = ${dateOfBirth || null},
        gender = ${gender || null},
        marital_status = ${maritalStatus || null},
        designation = ${designation || null},
        department_id = ${departmentId || null},
        salary = ${salary || null},
        role = ${role || null},
        image_url = ${imageUrl || null}
      WHERE id = ${params.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 })
  }
}

// DELETE employee
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await sql`
      DELETE FROM employees
      WHERE id = ${params.id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 })
  }
}
