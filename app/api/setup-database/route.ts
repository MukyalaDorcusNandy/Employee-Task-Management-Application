import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'employee_management',
  port: parseInt(process.env.DB_PORT || '3306')
}

export async function GET() {
  try {
    // First, try to connect without specifying database
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    })

    // Check if database exists
    const [databases] = await connection.execute('SHOW DATABASES LIKE ?', [dbConfig.database])
    
    if (databases.length === 0) {
      // Create database
      await connection.execute(`CREATE DATABASE ${dbConfig.database}`)
      console.log(`Database ${dbConfig.database} created`)
    }

    await connection.end()

    // Now connect to the specific database
    const dbConnection = await mysql.createConnection(dbConfig)

    // Check if tasks table exists
    const [tables] = await dbConnection.execute('SHOW TABLES LIKE ?', ['tasks'])
    
    if (tables.length === 0) {
      // Read and execute setup script
      const setupScript = fs.readFileSync(path.join(process.cwd(), 'scripts', 'setup-mysql.sql'), 'utf8')
      const statements = setupScript.split(';').filter(stmt => stmt.trim())
      
      for (const statement of statements) {
        if (statement.trim()) {
          await dbConnection.execute(statement)
        }
      }

      // Read and execute seed script
      const seedScript = fs.readFileSync(path.join(process.cwd(), 'scripts', 'seed-mysql.sql'), 'utf8')
      const seedStatements = seedScript.split(';').filter(stmt => stmt.trim())
      
      for (const statement of seedStatements) {
        if (statement.trim()) {
          await dbConnection.execute(statement)
        }
      }

      console.log('Database setup and seeding completed')
    }

    await dbConnection.end()

    return NextResponse.json({ 
      success: true, 
      message: 'Database setup completed successfully',
      database: dbConfig.database
    })

  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 })
  }
}
