import { NextRequest, NextResponse } from "next/server";
import { sql, handleDbError } from "@/lib/db";
import bcrypt from "bcryptjs"; // For password hashing if you use it

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const [user]: any = await sql(
      "SELECT * FROM employees WHERE email = ? LIMIT 1",
      [email]
    );

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // If passwords are hashed, use bcrypt
    // const isValid = await bcrypt.compare(password, user.password);
    // For plain password (not recommended in production)
    const isValid = user.password === password;

    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Remove password before sending to frontend
    delete user.password;

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: handleDbError(error) }, { status: 500 });
  }
}
