import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock data for now - you can replace with database later
    const mockAttendance = [
      {
        id: 1,
        employeeId: 1,
        employeeName: "John Doe",
        date: "2024-01-15",
        checkIn: "08:15",
        checkOut: "17:30",
        status: "Present",
        department: "IT"
      },
      {
        id: 2,
        employeeId: 2,
        employeeName: "Jane Smith",
        date: "2024-01-15",
        checkIn: "08:45",
        checkOut: "17:15",
        status: "Late",
        department: "HR"
      }
    ]
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return NextResponse.json(mockAttendance)
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    )
  }
}