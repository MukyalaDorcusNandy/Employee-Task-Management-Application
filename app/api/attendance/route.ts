import { type NextRequest, NextResponse } from "next/server"
import { sql, handleDbError } from "@/lib/db"

// GET attendance records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

    const attendance = await sql`
      SELECT 
        a.*,
        e.name as employee_name,
        e.employee_id as employee_code
      FROM attendance a
      LEFT JOIN employees e ON a.employee_id = e.id
      WHERE a.date = ${date}
      ORDER BY e.name ASC
    `

    return NextResponse.json(attendance)
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 })
  }
}

// POST mark attendance
export async function POST(request: NextRequest) {
  try {
    const { employeeId, date, checkIn, checkOut, status } = await request.json()

    if (!employeeId || !date) {
      return NextResponse.json({ error: "Employee ID and date are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO attendance (employee_id, date, check_in, check_out, status)
      VALUES (${employeeId}, ${date}, ${checkIn || null}, ${checkOut || null}, ${status || "present"})
      ON CONFLICT (employee_id, date) 
      DO UPDATE SET 
        check_in = EXCLUDED.check_in,
        check_out = EXCLUDED.check_out,
        status = EXCLUDED.status
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 })
  }
}
