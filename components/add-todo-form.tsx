/**
 * Form component for adding new todos
 * Handles input validation and submission
 */

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

interface AddTodoFormProps {
  onAdd: (title: string, description?: string, priority?: "low" | "medium" | "high", dueDate?: string) => void
}

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [dueDate, setDueDate] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    onAdd(title.trim(), description.trim() || undefined, priority, dueDate || undefined)
    setTitle("")
    setDescription("")
    setPriority("medium")
    setDueDate("")
    setIsExpanded(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className="flex-1 h-12 text-base"
          maxLength={100}
        />
        <Button type="submit" size="lg" disabled={!title.trim()} className="h-12 px-6">
          <Plus className="h-5 w-5 mr-2" />
          Add
        </Button>
      </div>

      {isExpanded && (
        <div className="animate-in slide-in-from-top-2 duration-200 space-y-3 p-4 border border-border rounded-lg bg-card">
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Add more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none mt-1.5"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority
              </Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger id="priority" className="mt-1.5">
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
              <Label htmlFor="dueDate" className="text-sm font-medium">
                Due Date (optional)
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1.5"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsExpanded(false)
                setDescription("")
                setPriority("medium")
                setDueDate("")
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}
