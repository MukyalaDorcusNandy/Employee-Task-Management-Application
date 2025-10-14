import { type NextRequest, NextResponse } from "next/server"
import { sql, handleDbError } from "@/lib/db"

// GET all leave requests
export async function GET() {
  try {
    const leaves = await sql`
      SELECT 
        lr.*,
        e.name as employee_name,
        e.employee_id as employee_code
      FROM leave_requests lr
      LEFT JOIN employees e ON lr.employee_id = e.id
      ORDER BY lr.created_at DESC
    `

    return NextResponse.json(leaves)
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 })
  }
}

// POST create new leave request
export async function POST(request: NextRequest) {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = await request.json()

    if (!employeeId || !leaveType || !startDate || !endDate) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status)
      VALUES (${employeeId}, ${leaveType}, ${startDate}, ${endDate}, ${reason || null}, 'pending')
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 })
  }
}
