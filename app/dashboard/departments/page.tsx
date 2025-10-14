"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Users } from "lucide-react"
import { DepartmentFormDialog } from "@/components/department-form-dialog"
import type { Department } from "@/lib/types/employee"

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments")
      const data = await response.json()
      setDepartments(data)
    } catch (error) {
      console.error("[v0] Error fetching departments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this department?")) return

    try {
      const response = await fetch(`/api/departments/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchDepartments()
      }
    } catch (error) {
      console.error("[v0] Error deleting department:", error)
    }
  }

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedDepartment(null)
    setDialogOpen(true)
  }

  if (loading) {
    return <div className="text-center py-12">Loading departments...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">Departments</h1>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 gap-2">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <div
            key={department.id}
            className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-yellow-500 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{department.name}</h3>
                </div>
              </div>
            </div>

            {department.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{department.description}</p>
            )}

            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <Button size="sm" variant="outline" onClick={() => handleEdit(department)} className="flex-1 gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(department.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {departments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No departments found. Add your first department to get started.
        </div>
      )}

      <DepartmentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        department={selectedDepartment}
        onSuccess={fetchDepartments}
      />
    </div>
  )
}
