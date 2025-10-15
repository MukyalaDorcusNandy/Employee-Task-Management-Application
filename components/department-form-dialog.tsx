"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Department } from "@/lib/types/employee"

interface DepartmentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  department?: Department | null
  onSuccess: () => void
}

export function DepartmentFormDialog({ open, onOpenChange, department, onSuccess }: DepartmentFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        description: department.description || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
      })
    }
  }, [department])

  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        description: "",
      })
      setError(null)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError("Department name is required")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const url = department ? `/api/departments/${department.id}` : "/api/departments"
      const method = department ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save department")
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving department:", error)
      setError("Failed to save department. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const dialogStyle = {
    maxWidth: '400px',
    width: '90vw',
    borderRadius: '8px',
    padding: '0',
    backgroundColor: 'white',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  }

  const formStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    padding: '20px',
  }

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  }

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  }

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  }

  const textareaStyle = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
  }

  const errorStyle = {
    fontSize: '14px',
    color: '#d32f2f',
    backgroundColor: '#ffebee',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #f5c6cb',
  }

  const footerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    padding: '16px 20px 20px',
    borderTop: '1px solid #eee',
  }

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#1976d2',
    color: 'white',
  }

  const outlineButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#333',
    border: '1px solid #ddd',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div style={dialogStyle}>
          <DialogHeader>
            <div style={{ padding: '20px 20px 0', margin: 0 }}>
              <DialogTitle>
                <span style={{ fontSize: '18px', fontWeight: 600 }}>
                  {department ? "Edit Department" : "Add Department"}
                </span>
              </DialogTitle>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} style={formStyle}>
            {error && (
              <div style={errorStyle}>
                {error}
              </div>
            )}

            <div style={inputGroupStyle}>
              <Label htmlFor="name" style={labelStyle}>Department Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Information Technology"
                disabled={loading}
                style={inputStyle}
              />
            </div>

            <div style={inputGroupStyle}>
              <Label htmlFor="description" style={labelStyle}>Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the department"
                rows={4}
                disabled={loading}
                style={textareaStyle}
              />
            </div>
            <DialogFooter>
              <div style={footerStyle}>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                  style={outlineButtonStyle}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    ...primaryButtonStyle,
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? "Saving..." : department ? "Update" : "Add Department"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}