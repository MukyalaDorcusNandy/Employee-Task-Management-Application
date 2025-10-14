import { type NextRequest, NextResponse } from "next/server"
import { sql, handleDbError } from "@/lib/db"

// GET all departments
export async function GET() {
  try {
    const departments = await sql`
      SELECT * FROM departments
      ORDER BY name ASC
    `

    return NextResponse.json(departments)
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 })
  }
}

// POST create new department
export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Department name is required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO departments (name, description)
      VALUES (${name}, ${description || null})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 })
  }
}
