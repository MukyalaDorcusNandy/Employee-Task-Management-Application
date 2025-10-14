/**
 * Core type definitions for the To-Do application
 */

export interface Todo {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export type TodoStatus = "todo" | "in-progress" | "done"

export interface UserProgress {
  xp: number
  level: number
  streak: number
  lastCompletionDate: string | null
  achievements: Achievement[]
  totalTasksCompleted: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
}

export const ACHIEVEMENTS_CONFIG = [
  { id: "first-task", title: "Getting Started", description: "Complete your first task", requiredTasks: 1, icon: "🎯" },
  { id: "task-warrior", title: "Task Warrior", description: "Complete 10 tasks", requiredTasks: 10, icon: "⚔️" },
  { id: "task-master", title: "Task Master", description: "Complete 25 tasks", requiredTasks: 25, icon: "👑" },
  { id: "task-legend", title: "Task Legend", description: "Complete 50 tasks", requiredTasks: 50, icon: "🏆" },
  {
    id: "streak-3",
    title: "3-Day Streak",
    description: "Complete tasks for 3 days in a row",
    requiredStreak: 3,
    icon: "🔥",
  },
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "Complete tasks for 7 days in a row",
    requiredStreak: 7,
    icon: "⚡",
  },
  { id: "level-5", title: "Level 5 Hero", description: "Reach level 5", requiredLevel: 5, icon: "🌟" },
  { id: "level-10", title: "Level 10 Champion", description: "Reach level 10", requiredLevel: 10, icon: "💎" },
] as const

export const XP_PER_TASK = 10
export const XP_PER_LEVEL = 100
