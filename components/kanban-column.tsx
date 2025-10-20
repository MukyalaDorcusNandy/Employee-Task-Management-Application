"use client"

import { TaskCard } from "./task-card"

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

interface KanbanColumnProps {
  title: string
  status: string
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
  onStatusChange: (taskId: number, newStatus: string) => void
  color: string
}

export function KanbanColumn({ 
  title, 
  status, 
  tasks, 
  onEdit, 
  onDelete, 
  onStatusChange, 
  color 
}: KanbanColumnProps) {
  return (
    <div className="flex-1 min-w-80">
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {tasks.length}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-3 min-h-96">
          {tasks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">No tasks in this column</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}