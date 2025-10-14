/**
 * Main todo list component - Kanban board view
 * Manages state and orchestrates all todo operations with drag-and-drop
 */

"use client"

import { useState, useEffect, useMemo } from "react"
import type { Todo, TodoStatus, UserProgress } from "@/lib/types"
import { getTodos, saveTodos, generateId } from "@/lib/storage"
import { getUserProgress, saveUserProgress } from "@/lib/storage"
import { awardXP } from "@/lib/gamification"
import { AddTodoForm } from "./add-todo-form"
import { KanbanColumn } from "./kanban-column"
import { ProgressHeader } from "./progress-header"
import { CelebrationModal } from "./celebration-modal"
import { AchievementsPanel } from "./achievements-panel"
import { SearchFilter } from "./search-filter"
import { ThemeToggle } from "./theme-toggle"

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [progress, setProgress] = useState<UserProgress>({
    xp: 0,
    level: 1,
    streak: 0,
    lastCompletionDate: null,
    achievements: [],
    totalTasksCompleted: 0,
  })
  const [celebration, setCelebration] = useState<{
    show: boolean
    type: "levelUp" | "achievement"
    level?: number
    achievement?: any
  }>({
    show: false,
    type: "levelUp",
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<Set<string>>(new Set())
  const [showOverdue, setShowOverdue] = useState(false)

  // Load todos from localStorage on mount
  useEffect(() => {
    const loadedTodos = getTodos()
    const loadedProgress = getUserProgress()
    setTodos(loadedTodos)
    setProgress(loadedProgress)
    setIsLoaded(true)
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveTodos(todos)
    }
  }, [todos, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveUserProgress(progress)
    }
  }, [progress, isLoaded])

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = todo.title.toLowerCase().includes(query)
        const matchesDescription = todo.description?.toLowerCase().includes(query)
        if (!matchesTitle && !matchesDescription) return false
      }

      // Priority filter
      if (priorityFilter.size > 0 && !priorityFilter.has(todo.priority)) {
        return false
      }

      // Overdue filter
      if (showOverdue) {
        if (!todo.dueDate) return false
        const isOverdue = new Date(todo.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))
        if (!isOverdue || todo.status === "done") return false
      }

      return true
    })
  }, [todos, searchQuery, priorityFilter, showOverdue])

  const addTodo = (title: string, description?: string, priority?: "low" | "medium" | "high", dueDate?: string) => {
    const newTodo: Todo = {
      id: generateId(),
      title,
      description,
      status: "todo",
      priority: priority || "medium",
      dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setTodos((prev) => [newTodo, ...prev])
  }

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    const todo = todos.find((t) => t.id === id)
    const wasNotDone = todo && todo.status !== "done"
    const isNowDone = updates.status === "done"

    if (wasNotDone && isNowDone) {
      const { newProgress, leveledUp, newAchievements } = awardXP(progress)
      setProgress(newProgress)

      // Show celebration for level up
      if (leveledUp) {
        setCelebration({
          show: true,
          type: "levelUp",
          level: newProgress.level,
        })
      }
      // Show celebration for first new achievement
      else if (newAchievements.length > 0) {
        setCelebration({
          show: true,
          type: "achievement",
          achievement: newAchievements[0],
        })
      }
    }

    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updates, updatedAt: new Date().toISOString() } : todo)),
    )
  }

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const handleDrop = (todoId: string, newStatus: TodoStatus) => {
    updateTodo(todoId, { status: newStatus })
  }

  const todosByStatus = {
    todo: filteredTodos.filter((t) => t.status === "todo"),
    "in-progress": filteredTodos.filter((t) => t.status === "in-progress"),
    done: filteredTodos.filter((t) => t.status === "done"),
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ProgressHeader progress={progress} />
        <ThemeToggle />
      </div>

      <AchievementsPanel progress={progress} />

      <AddTodoForm onAdd={addTodo} />

      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        showOverdue={showOverdue}
        onShowOverdueChange={setShowOverdue}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KanbanColumn
          status="todo"
          todos={todosByStatus.todo}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          onDrop={handleDrop}
        />
        <KanbanColumn
          status="in-progress"
          todos={todosByStatus["in-progress"]}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          onDrop={handleDrop}
        />
        <KanbanColumn
          status="done"
          todos={todosByStatus.done}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          onDrop={handleDrop}
        />
      </div>

      {todos.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          {filteredTodos.length < todos.length && (
            <span className="mr-2">
              Showing {filteredTodos.length} of {todos.length} tasks •
            </span>
          )}
          {todosByStatus.todo.length} to do • {todosByStatus["in-progress"].length} in progress •{" "}
          {todosByStatus.done.length} done
        </div>
      )}

      <CelebrationModal
        show={celebration.show}
        type={celebration.type}
        level={celebration.level}
        achievement={celebration.achievement}
        onClose={() => setCelebration({ ...celebration, show: false })}
      />
    </div>
  )
}
/**
 * Main todo list component - Kanban board view
 * Manages state and orchestrates all todo operations with drag-and-drop
 */

"use client"

import { useState, useEffect, useMemo } from "react"
import type { Todo, TodoStatus, UserProgress } from "@/lib/types"
import { getTodos, saveTodos, generateId } from "@/lib/storage"
import { getUserProgress, saveUserProgress } from "@/lib/storage"
import { awardXP } from "@/lib/gamification"
import { AddTodoForm } from "./add-todo-form"
import { KanbanColumn } from "./kanban-column"
import { ProgressHeader } from "./progress-header"
import { CelebrationModal } from "./celebration-modal"
import { AchievementsPanel } from "./achievements-panel"
import { SearchFilter } from "./search-filter"
import { ThemeToggle } from "./theme-toggle"

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [progress, setProgress] = useState<UserProgress>({
    xp: 0,
    level: 1,
    streak: 0,
    lastCompletionDate: null,
    achievements: [],
    totalTasksCompleted: 0,
  })
  const [celebration, setCelebration] = useState<{
    show: boolean
    type: "levelUp" | "achievement"
    level?: number
    achievement?: any
  }>({
    show: false,
    type: "levelUp",
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<Set<string>>(new Set())
  const [showOverdue, setShowOverdue] = useState(false)

  // Load todos from localStorage on mount
  useEffect(() => {
    const loadedTodos = getTodos()
    const loadedProgress = getUserProgress()
    setTodos(loadedTodos)
    setProgress(loadedProgress)
    setIsLoaded(true)
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveTodos(todos)
    }
  }, [todos, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveUserProgress(progress)
    }
  }, [progress, isLoaded])

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = todo.title.toLowerCase().includes(query)
        const matchesDescription = todo.description?.toLowerCase().includes(query)
        if (!matchesTitle && !matchesDescription) return false
      }

      // Priority filter
      if (priorityFilter.size > 0 && !priorityFilter.has(todo.priority)) {
        return false
      }

      // Overdue filter
      if (showOverdue) {
        if (!todo.dueDate) return false
        const isOverdue = new Date(todo.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))
        if (!isOverdue || todo.status === "done") return false
      }

      return true
    })
  }, [todos, searchQuery, priorityFilter, showOverdue])

  const addTodo = (title: string, description?: string, priority?: "low" | "medium" | "high", dueDate?: string) => {
    const newTodo: Todo = {
      id: generateId(),
      title,
      description,
      status: "todo",
      priority: priority || "medium",
      dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setTodos((prev) => [newTodo, ...prev])
  }

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    const todo = todos.find((t) => t.id === id)
    const wasNotDone = todo && todo.status !== "done"
    const isNowDone = updates.status === "done"

    if (wasNotDone && isNowDone) {
      const { newProgress, leveledUp, newAchievements } = awardXP(progress)
      setProgress(newProgress)

      // Show celebration for level up
      if (leveledUp) {
        setCelebration({
          show: true,
          type: "levelUp",
          level: newProgress.level,
        })
      }
      // Show celebration for first new achievement
      else if (newAchievements.length > 0) {
        setCelebration({
          show: true,
          type: "achievement",
          achievement: newAchievements[0],
        })
      }
    }

    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updates, updatedAt: new Date().toISOString() } : todo)),
    )
  }

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const handleDrop = (todoId: string, newStatus: TodoStatus) => {
    updateTodo(todoId, { status: newStatus })
  }

  const todosByStatus = {
    todo: filteredTodos.filter((t) => t.status === "todo"),
    "in-progress": filteredTodos.filter((t) => t.status === "in-progress"),
    done: filteredTodos.filter((t) => t.status === "done"),
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ProgressHeader progress={progress} />
        <ThemeToggle />
      </div>

      <AchievementsPanel progress={progress} />

      <AddTodoForm onAdd={addTodo} />

      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        showOverdue={showOverdue}
        onShowOverdueChange={setShowOverdue}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KanbanColumn
          status="todo"
          todos={todosByStatus.todo}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          onDrop={handleDrop}
        />
        <KanbanColumn
          status="in-progress"
          todos={todosByStatus["in-progress"]}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          onDrop={handleDrop}
        />
        <KanbanColumn
          status="done"
          todos={todosByStatus.done}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          onDrop={handleDrop}
        />
      </div>

      {todos.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          {filteredTodos.length < todos.length && (
            <span className="mr-2">
              Showing {filteredTodos.length} of {todos.length} tasks •
            </span>
          )}
          {todosByStatus.todo.length} to do • {todosByStatus["in-progress"].length} in progress •{" "}
          {todosByStatus.done.length} done
        </div>
      )}

      <CelebrationModal
        show={celebration.show}
        type={celebration.type}
        level={celebration.level}
        achievement={celebration.achievement}
        onClose={() => setCelebration({ ...celebration, show: false })}
      />
    </div>
  )
}
