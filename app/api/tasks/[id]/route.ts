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
        t.*,
        e1.name as created_by_name,
        e2.name as assigned_to_name,
        d.name as department_name
      FROM tasks t
      LEFT JOIN employees e1 ON t.created_by = e1.id
      LEFT JOIN employees e2 ON t.assigned_to = e2.id
      LEFT JOIN departments d ON t.department_id = d.id
      WHERE t.id = ?
    `, [params.id])
    
    await connection.end()
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, description, status, priority, due_date, assigned_to, department_id } = body
    
    const connection = await mysql.createConnection(dbConfig)
    
    await connection.execute(
      `UPDATE tasks 
       SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, assigned_to = ?, department_id = ?
       WHERE id = ?`,
      [title, description, status, priority, due_date, assigned_to, department_id, params.id]
    )
    
    await connection.end()
    return NextResponse.json({ message: 'Task updated successfully' })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connection = await mysql.createConnection(dbConfig)
    
    await connection.execute('DELETE FROM tasks WHERE id = ?', [params.id])
    
    await connection.end()
    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
