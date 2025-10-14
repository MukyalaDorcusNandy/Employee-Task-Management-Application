/**
 * Individual todo item component
 * Displays todo with edit, delete, and drag functionality
 */

"use client"

import type React from "react"

import { useState } from "react"
import type { Todo, TodoStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Check, X, GripVertical, Calendar, AlertCircle } from "lucide-react"

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
  status: TodoStatus
}

function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false
  return new Date(dueDate) < new Date(new Date().setHours(0, 0, 0, 0))
}

function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.getTime() === today.getTime()) return "Today"
  if (date.getTime() === tomorrow.getTime()) return "Tomorrow"

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function TodoItem({ todo, onUpdate, onDelete, status }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || "")
  const [editPriority, setEditPriority] = useState(todo.priority)
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || "")
  const [isDragging, setIsDragging] = useState(false)

  const handleSave = () => {
    if (!editTitle.trim()) return

    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
      dueDate: editDueDate || undefined,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || "")
    setEditPriority(todo.priority)
    setEditDueDate(todo.dueDate || "")
    setIsEditing(false)
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("todoId", todo.id)
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const priorityColors = {
    high: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    low: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  }

  const overdue = isOverdue(todo.dueDate)

  if (isEditing) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 space-y-3 animate-in fade-in duration-200">
        <div>
          <Label htmlFor="edit-title" className="text-sm font-medium">
            Title
          </Label>
          <Input
            id="edit-title"
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="font-medium mt-1.5"
            maxLength={100}
            autoFocus
          />
        </div>

        <div>
          <Label htmlFor="edit-description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="edit-description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description (optional)..."
            className="resize-none mt-1.5"
            rows={3}
            maxLength={500}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="edit-priority" className="text-sm font-medium">
              Priority
            </Label>
            <Select value={editPriority} onValueChange={(value: any) => setEditPriority(value)}>
              <SelectTrigger id="edit-priority" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="edit-dueDate" className="text-sm font-medium">
              Due Date
            </Label>
            <Input
              id="edit-dueDate"
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="mt-1.5"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={handleSave} disabled={!editTitle.trim()}>
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        todo-card bg-card border rounded-lg p-4 
        transition-all duration-200 hover:shadow-md
        ${isDragging ? "opacity-50 scale-95" : ""}
        ${overdue && status !== "done" ? "border-red-300 dark:border-red-800" : "border-border"}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="cursor-grab active:cursor-grabbing pt-1">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <h3 className="font-medium text-base leading-relaxed text-foreground flex-1">{todo.title}</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${priorityColors[todo.priority]}`}
            >
              {todo.priority}
            </span>
          </div>

          {todo.description && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{todo.description}</p>}

          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span>
              Created{" "}
              {new Date(todo.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>

            {todo.dueDate && (
              <span
                className={`flex items-center gap-1 ${overdue && status !== "done" ? "text-red-600 dark:text-red-400 font-medium" : ""}`}
              >
                {overdue && status !== "done" && <AlertCircle className="h-3 w-3" />}
                <Calendar className="h-3 w-3" />
                {formatDueDate(todo.dueDate)}
                {overdue && status !== "done" && " (Overdue)"}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            aria-label={`Edit "${todo.title}"`}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(todo.id)}
            aria-label={`Delete "${todo.title}"`}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
