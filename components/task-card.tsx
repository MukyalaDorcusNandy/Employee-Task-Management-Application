"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  User, 
  Building2, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  MessageSquare,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: number
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date: string
  created_by_name: string
  assigned_to_name: string
  department_name: string
  created_at: string
}

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
  onStatusChange: (taskId: number, newStatus: string) => void
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [showActions, setShowActions] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'completed'

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium line-clamp-2">
            {task.title}
          </CardTitle>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(!showActions)}
              className="h-8 w-8 p-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            {showActions && (
              <div className="absolute right-0 top-8 bg-white border rounded-md shadow-lg z-10 min-w-[120px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onEdit(task)
                    setShowActions(false)
                  }}
                  className="w-full justify-start"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onDelete(task.id)
                    setShowActions(false)
                  }}
                  className="w-full justify-start text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
              {task.priority}
            </Badge>
            <Badge className={cn("text-xs", getStatusColor(task.status))}>
              {task.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span className={cn(isOverdue && "text-red-600 font-medium")}>
              Due: {new Date(task.due_date).toLocaleDateString()}
            </span>
          </div>

          {task.assigned_to_name && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <User className="h-3 w-3" />
              <span>{task.assigned_to_name}</span>
            </div>
          )}

          {task.department_name && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Building2 className="h-3 w-3" />
              <span>{task.department_name}</span>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(task.id, 'todo')}
                className={cn(
                  "h-6 px-2 text-xs",
                  task.status === 'todo' && "bg-gray-100"
                )}
              >
                To Do
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(task.id, 'in_progress')}
                className={cn(
                  "h-6 px-2 text-xs",
                  task.status === 'in_progress' && "bg-blue-100"
                )}
              >
                In Progress
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(task.id, 'completed')}
                className={cn(
                  "h-6 px-2 text-xs",
                  task.status === 'completed' && "bg-green-100"
                )}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
