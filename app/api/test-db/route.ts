import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const employees = await query('SELECT * FROM employees');
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected successfully!',
      data: employees 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    }, { status: 500 });
  }
}