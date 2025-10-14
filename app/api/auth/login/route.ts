import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // For demo purposes, we're using simple password comparison
    // In production, use bcrypt or similar for password hashing
    const result = await sql`
      SELECT id, email, name 
      FROM admins 
      WHERE email = ${email} AND password = ${password}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const admin = result[0]

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    })

    // Set session cookie (in production, use proper session management)
    response.cookies.set("admin_session", JSON.stringify(admin), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
