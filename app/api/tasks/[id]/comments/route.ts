import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'employee_management',
  port: parseInt(process.env.DB_PORT || '3306')
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connection = await mysql.createConnection(dbConfig)
    
    const [rows] = await connection.execute(`
      SELECT 
        tc.*,
        e.name as employee_name
      FROM task_comments tc
      LEFT JOIN employees e ON tc.employee_id = e.id
      WHERE tc.task_id = ?
      ORDER BY tc.created_at ASC
    `, [params.id])
    
    await connection.end()
    return NextResponse.json(Array.isArray(rows) ? rows : [])
  } catch (error) {
    console.error('Error fetching task comments:', error)
    return NextResponse.json({ error: 'Failed to fetch task comments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { comment, employee_id } = body
    
    const connection = await mysql.createConnection(dbConfig)
    
    const [result] = await connection.execute(
      `INSERT INTO task_comments (task_id, employee_id, comment) VALUES (?, ?, ?)`,
      [params.id, employee_id, comment]
    )
    
    await connection.end()
    return NextResponse.json({ id: (result as any).insertId, message: 'Comment added successfully' })
  } catch (error) {
    console.error('Error adding comment:', error)
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}
