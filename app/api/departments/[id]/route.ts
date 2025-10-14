import { type NextRequest, NextResponse } from "next/server"
import { sql, handleDbError } from "@/lib/db"

// GET single department
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await sql`
      SELECT * FROM departments
      WHERE id = ${params.id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 })
  }
}

// PUT update department
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Department name is required" }, { status: 400 })
    }

    const result = await sql`
      UPDATE departments
      SET name = ${name}, description = ${description || null}
      WHERE id = ${params.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 })
  }
}

// DELETE department
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await sql`
      DELETE FROM departments
      WHERE id = ${params.id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 })
  }
}
