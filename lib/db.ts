import { neon } from "@neondatabase/serverless"

// Initialize Neon database connection
export const sql = neon(process.env.DATABASE_URL!)

// Helper function to handle database errors
export function handleDbError(error: unknown): string {
  console.error("[v0] Database error:", error)
  if (error instanceof Error) {
    return error.message
  }
  return "An unknown database error occurred"
}
