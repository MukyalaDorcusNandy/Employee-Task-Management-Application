"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Check, X } from "lucide-react"
import { LeaveFormDialog } from "@/components/leave-form-dialog"
import type { LeaveRequest } from "@/lib/types/employee"

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchLeaves()
  }, [])

  const fetchLeaves = async () => {
    try {
      const response = await fetch("/api/leaves")
      const data = await response.json()
      setLeaves(data)
    } catch (error) {
      console.error("[v0] Error fetching leaves:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/leaves/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchLeaves()
      }
    } catch (error) {
      console.error("[v0] Error updating leave status:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading leave requests...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">Leave Management</h1>
        <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90 gap-2">
          <Plus className="h-4 w-4" />
          Add Leave Request
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Employee</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Leave Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Start Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">End Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Reason</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Status</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leaves.map((leave: any) => (
                <tr key={leave.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {leave.employee_name}
                    <div className="text-xs text-muted-foreground">{leave.employee_code}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{leave.leave_type}</td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {new Date(leave.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{new Date(leave.end_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{leave.reason || "-"}</td>
                  <td className="px-6 py-4 text-sm">{getStatusBadge(leave.status)}</td>
                  <td className="px-6 py-4 text-right text-sm">
                    {leave.status === "pending" && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(leave.id, "approved")}
                          className="text-green-600 hover:text-green-700 gap-1"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(leave.id, "rejected")}
                          className="text-red-600 hover:text-red-700 gap-1"
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {leaves.length === 0 && <div className="text-center py-12 text-muted-foreground">No leave requests found</div>}
      </div>

      <LeaveFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSuccess={fetchLeaves} />
    </div>
  )
}
