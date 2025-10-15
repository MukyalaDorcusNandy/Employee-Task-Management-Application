// components/employee-form-dialog.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import type { Employee, Department } from "@/lib/types/employee"

interface EmployeeFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee?: Employee
  departments: Department[]
  onSave: (employee: Omit<Employee, "id" | "createdAt">) => void
}

export function EmployeeFormDialog({ 
  open, 
  onOpenChange, 
  employee, 
  departments, 
  onSave 
}: EmployeeFormDialogProps) {
  const [formData, setFormData] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
    employeeId: employee?.employeeId || "",
    designation: employee?.designation || "",
    departmentId: employee?.departmentId?.toString() || "",
    salary: employee?.salary?.toString() || ""
  })

  const handleSave = () => {
    onSave({
      ...formData,
      departmentId: formData.departmentId ? parseInt(formData.departmentId) : undefined,
      salary: formData.salary ? parseFloat(formData.salary) : undefined,
      employeeId: formData.employeeId,
      name: formData.name,
      email: formData.email,
      designation: formData.designation,
      department_name: "",
      employee_id: ""
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {employee ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              placeholder="Enter employee ID"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              placeholder="Enter designation"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="department">Department</Label>
            <Select value={formData.departmentId} onValueChange={(value) => setFormData({ ...formData, departmentId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="Enter salary"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {employee ? "Update" : "Add"} Employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}