import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const departments = await sql(
      "SELECT id, name, description, created_at, updated_at FROM departments ORDER BY name ASC"
    )
    
    return NextResponse.json(departments)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json()
    
    const result = await sql(
      "INSERT INTO departments (name, description) VALUES (?, ?)",
      [name, description]
    )
    
    // For MySQL, we need to fetch the inserted record separately
    const [newDept]: any = await sql(
      "SELECT * FROM departments WHERE id = LAST_INSERT_ID()"
    )
    
    return NextResponse.json(newDept)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create department' },
      { status: 500 }
    )
  }
}