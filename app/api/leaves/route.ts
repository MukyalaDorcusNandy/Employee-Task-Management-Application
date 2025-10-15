import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock data for now - you can replace with database later
    const mockLeaves = [
      {
        id: 1,
        employee_name: "John Doe",
        employee_code: "EMP001",
        leave_type: "Annual Leave",
        start_date: "2024-01-20",
        end_date: "2024-01-25",
        reason: "Family vacation",
        status: "pending"
      },
      {
        id: 2,
        employee_name: "Jane Smith",
        employee_code: "EMP002",
        leave_type: "Sick Leave",
        start_date: "2024-01-18",
        end_date: "2024-01-19",
        reason: "Medical appointment",
        status: "approved"
      }
    ]
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return NextResponse.json(mockLeaves)
  } catch (error) {
    console.error("Error fetching leaves:", error)
    return NextResponse.json(
      { error: "Failed to fetch leaves" },
      { status: 500 }
    )
  }
}