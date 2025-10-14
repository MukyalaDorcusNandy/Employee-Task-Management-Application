"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function DashboardHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <h2 className="text-lg font-medium text-card-foreground">Welcome, Admin</h2>
      <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </header>
  )
}
