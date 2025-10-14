import { NextResponse } from "next/server"
import { sql, handleDbError } from "@/lib/db"
import type { DashboardStats } from "@/lib/types/employee"

export async function GET() {
  try {
    // Get total employees
    const employeeCount = await sql`SELECT COUNT(*) as count FROM employees`

    // Get total departments
    const departmentCount = await sql`SELECT COUNT(*) as count FROM departments`

    // Get total monthly pay
    const salarySum = await sql`SELECT COALESCE(SUM(salary), 0) as total FROM employees`

    // Get leave statistics
    const leaveStats = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'approved') as approved,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
        COUNT(*) as total
      FROM leave_requests
    `

    const stats: DashboardStats = {
      totalEmployees: Number(employeeCount[0].count),
      totalDepartments: Number(departmentCount[0].count),
      monthlyPay: Number(salarySum[0].total),
      leaveApplied: Number(leaveStats[0].total),
      leaveApproved: Number(leaveStats[0].approved),
      leavePending: Number(leaveStats[0].pending),
      leaveRejected: Number(leaveStats[0].rejected),
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 })
  }
}
