import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET single department
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const departments: any = await query(
      "SELECT id, name, description, created_at, updated_at FROM departments WHERE id = ?",
      [params.id]
    )

    if (departments.length === 0) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(departments[0])
  } catch (error: any) {
    console.error("GET department error:", error)
    return NextResponse.json(
      { error: "Failed to fetch department" },
      { status: 500 }
    )
  }
}

// PUT update department
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description } = await request.json()

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: "Department name is required" },
        { status: 400 }
      )
    }

    const result: any = await query(
      "UPDATE departments SET name = ?, description = ? WHERE id = ?",
      [name.trim(), description?.trim() || null, params.id]
    )

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      )
    }

    // Fetch the updated department - FIXED THIS PART
    const departments: any = await query(
      "SELECT id, name, description, created_at, updated_at FROM departments WHERE id = ?",
      [params.id]
    )

    return NextResponse.json(departments[0])
  } catch (error: any) {
    console.error("PUT department error:", error)
    
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: "A department with this name already exists" },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to update department" },
      { status: 500 }
    )
  }
}

// DELETE department
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result: any = await query(
      "DELETE FROM departments WHERE id = ?",
      [params.id]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Department deleted successfully" })
  } catch (error: any) {
    console.error("DELETE department error:", error)
    return NextResponse.json(
      { error: "Failed to delete department" },
      { status: 500 }
    )
  }
}