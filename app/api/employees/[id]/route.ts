import { NextRequest, NextResponse } from "next/server";
import { sql, handleDbError } from "@/lib/db";

// GET single employee
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [employee]: any = await sql(
      `SELECT e.*, d.name AS department_name
       FROM employees e
       LEFT JOIN departments d ON e.department_id = d.id
       WHERE e.id = ?`,
      [params.id]
    );

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 });
  }
}

// PUT update employee
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const {
      employeeId,
      name,
      email,
      dateOfBirth,
      gender,
      maritalStatus,
      designation,
      departmentId,
      salary,
      role,
      imageUrl,
      password
    } = body;

    await sql(
      `UPDATE employees
       SET employee_id = ?, name = ?, email = ?, date_of_birth = ?, gender = ?, marital_status = ?, designation = ?, department_id = ?, salary = ?, role = ?, image_url = ?, password = ?
       WHERE id = ?`,
      [
        employeeId,
        name,
        email,
        dateOfBirth || null,
        gender || null,
        maritalStatus || null,
        designation || null,
        departmentId || null,
        salary || null,
        role || null,
        imageUrl || null,
        password || null,
        params.id
      ]
    );

    const [updatedEmployee]: any = await sql("SELECT * FROM employees WHERE id = ?", [params.id]);
    return NextResponse.json(updatedEmployee);
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 });
  }
}

// DELETE employee
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result: any = await sql("DELETE FROM employees WHERE id = ?", [params.id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 });
  }
}
