/**
 * Kanban column component for drag-and-drop board
 * Represents a single status column (To Do, In Progress, Done)
 */

"use client"

import type React from "react"

import { useState } from "react"
import type { Todo, TodoStatus } from "@/lib/types"
import { TodoItem } from "./todo-item"
import { Circle, Clock, CheckCircle2 } from "lucide-react"

interface KanbanColumnProps {
  status: TodoStatus
  todos: Todo[]
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
  onDrop: (todoId: string, newStatus: TodoStatus) => void
}

const columnConfig = {
  todo: {
    title: "To Do",
    icon: Circle,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    badgeColor: "bg-blue-500",
  },
  "in-progress": {
    title: "In Progress",
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    badgeColor: "bg-amber-500",
  },
  done: {
    title: "Done",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    badgeColor: "bg-emerald-500",
  },
}

export function KanbanColumn({ status, todos, onUpdate, onDelete, onDrop }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const config = columnConfig[status]
  const Icon = config.icon

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const todoId = e.dataTransfer.getData("todoId")
    if (todoId) {
      onDrop(todoId, status)
    }
  }

  const baseClasses = "flex flex-col rounded-lg border-2 min-h-96 transition-all duration-200"
  const dragClasses = isDragOver ? "bg-accent/10 border-accent scale-[1.02]" : ""
  const columnClasses = `${baseClasses} ${config.borderColor} ${config.bgColor} ${dragClasses}`

  return (
    <div className={columnClasses} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      {/* Column Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            <h2 className="font-semibold text-lg">{config.title}</h2>
          </div>
          <div className={`${config.badgeColor} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>
            {todos.length}
          </div>
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {todos.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">Drop tasks here</div>
        ) : (
          todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdate={onUpdate} onDelete={onDelete} status={status} />
          ))
        )}
      </div>
    </div>
  )
}
