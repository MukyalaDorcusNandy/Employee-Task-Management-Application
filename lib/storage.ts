/**
 * localStorage utility functions for persisting todos
 * Handles all data persistence operations with error handling
 */

import type { Todo, UserProgress } from "./types"

const STORAGE_KEY = "aibos-todos"
const PROGRESS_KEY = "aibos-user-progress"

/**
 * Retrieves all todos from localStorage
 * @returns Array of todos, or empty array if none exist
 */
export function getTodos(): Todo[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const todos: Todo[] = stored ? JSON.parse(stored) : []
    return todos.map((todo) => {
      if ("completed" in todo && !("status" in todo)) {
        const { completed, ...rest } = todo as any
        return {
          ...rest,
          status: completed ? "done" : "todo",
          priority: "medium",
        } as Todo
      }
      // Add default priority if missing
      if (!todo.priority) {
        return { ...todo, priority: "medium" as const }
      }
      return todo
    })
  } catch (error) {
    console.error("Error reading todos from localStorage:", error)
    return []
  }
}

/**
 * Saves todos array to localStorage
 * @param todos - Array of todos to save
 */
export function saveTodos(todos: Todo[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch (error) {
    console.error("Error saving todos to localStorage:", error)
  }
}

/**
 * Generates a unique ID for new todos
 * @returns Unique string ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Retrieves user progress from localStorage
 * @returns User progress object, or default values if none exist
 */
export function getUserProgress(): UserProgress {
  if (typeof window === "undefined") {
    return {
      xp: 0,
      level: 1,
      streak: 0,
      lastCompletionDate: null,
      achievements: [],
      totalTasksCompleted: 0,
    }
  }

  try {
    const stored = localStorage.getItem(PROGRESS_KEY)
    if (!stored) {
      return {
        xp: 0,
        level: 1,
        streak: 0,
        lastCompletionDate: null,
        achievements: [],
        totalTasksCompleted: 0,
      }
    }
    return JSON.parse(stored)
  } catch (error) {
    console.error("Error reading user progress from localStorage:", error)
    return {
      xp: 0,
      level: 1,
      streak: 0,
      lastCompletionDate: null,
      achievements: [],
      totalTasksCompleted: 0,
    }
  }
}

/**
 * Saves user progress to localStorage
 * @param progress - User progress object to save
 */
export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error("Error saving user progress to localStorage:", error)
  }
}
