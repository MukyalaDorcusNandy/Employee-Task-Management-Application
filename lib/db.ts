// lib/db.ts
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // XAMPP default
  database: "employee_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function sql(query: string, params: any[] = []) {
  const [rows] = await pool.execute(query, params);
  return rows;
}

export function handleDbError(error: unknown) {
  console.error(error);
  return error instanceof Error ? error.message : String(error);
}
