import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'employee_management',
  port: parseInt(process.env.DB_PORT || '3306')
}

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    
    const [rows] = await connection.execute(`
      SELECT 
        t.*,
        e1.name as created_by_name,
        e2.name as assigned_to_name,
        d.name as department_name
      FROM tasks t
      LEFT JOIN employees e1 ON t.created_by = e1.id
      LEFT JOIN employees e2 ON t.assigned_to = e2.id
      LEFT JOIN departments d ON t.department_id = d.id
      ORDER BY t.created_at DESC
    `)
    
    await connection.end()
    return NextResponse.json(Array.isArray(rows) ? rows : [])
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, priority, due_date, created_by, assigned_to, department_id } = body
    
    const connection = await mysql.createConnection(dbConfig)
    
    const [result] = await connection.execute(
      `INSERT INTO tasks (title, description, priority, due_date, created_by, assigned_to, department_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, priority, due_date, created_by, assigned_to, department_id]
    )
    
    await connection.end()
    return NextResponse.json({ id: (result as any).insertId, message: 'Task created successfully' })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
