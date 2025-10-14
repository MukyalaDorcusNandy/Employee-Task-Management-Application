/**
 * Gamification logic for XP, levels, achievements, and streaks
 */

import type { UserProgress, Achievement } from "./types"
import { ACHIEVEMENTS_CONFIG, XP_PER_TASK, XP_PER_LEVEL } from "./types"

/**
 * Calculate level from XP
 */
export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

/**
 * Calculate XP progress within current level
 */
export function calculateLevelProgress(xp: number): { current: number; required: number; percentage: number } {
  const current = xp % XP_PER_LEVEL
  const required = XP_PER_LEVEL
  const percentage = (current / required) * 100

  return { current, required, percentage }
}

/**
 * Check if date is today
 */
function isToday(dateString: string | null): boolean {
  if (!dateString) return false
  const date = new Date(dateString)
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Check if date is yesterday
 */
function isYesterday(dateString: string | null): boolean {
  if (!dateString) return false
  const date = new Date(dateString)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  )
}

/**
 * Update streak based on completion
 */
export function updateStreak(lastCompletionDate: string | null): { streak: number; isNewStreak: boolean } {
  if (isToday(lastCompletionDate)) {
    // Already completed today, maintain streak
    return { streak: 0, isNewStreak: false }
  }

  if (isYesterday(lastCompletionDate)) {
    // Completed yesterday, increment streak
    return { streak: 1, isNewStreak: true }
  }

  // First completion or streak broken, start new streak
  return { streak: 1, isNewStreak: true }
}

/**
 * Check for new achievements
 */
export function checkAchievements(progress: UserProgress, existingAchievements: Achievement[]): Achievement[] {
  const newAchievements: Achievement[] = []
  const existingIds = new Set(existingAchievements.map((a) => a.id))

  for (const config of ACHIEVEMENTS_CONFIG) {
    if (existingIds.has(config.id)) continue

    let unlocked = false

    if ("requiredTasks" in config && progress.totalTasksCompleted >= config.requiredTasks) {
      unlocked = true
    } else if ("requiredStreak" in config && progress.streak >= config.requiredStreak) {
      unlocked = true
    } else if ("requiredLevel" in config && progress.level >= config.requiredLevel) {
      unlocked = true
    }

    if (unlocked) {
      newAchievements.push({
        id: config.id,
        title: config.title,
        description: config.description,
        icon: config.icon,
        unlockedAt: new Date().toISOString(),
      })
    }
  }

  return newAchievements
}

/**
 * Award XP and update progress
 */
export function awardXP(currentProgress: UserProgress): {
  newProgress: UserProgress
  leveledUp: boolean
  newAchievements: Achievement[]
} {
  const oldLevel = currentProgress.level
  const newXP = currentProgress.xp + XP_PER_TASK
  const newLevel = calculateLevel(newXP)
  const leveledUp = newLevel > oldLevel

  const streakUpdate = updateStreak(currentProgress.lastCompletionDate)
  const newStreak = streakUpdate.isNewStreak ? currentProgress.streak + streakUpdate.streak : currentProgress.streak

  const updatedProgress: UserProgress = {
    ...currentProgress,
    xp: newXP,
    level: newLevel,
    streak: newStreak,
    lastCompletionDate: new Date().toISOString(),
    totalTasksCompleted: currentProgress.totalTasksCompleted + 1,
  }

  const newAchievements = checkAchievements(updatedProgress, currentProgress.achievements)

  return {
    newProgress: {
      ...updatedProgress,
      achievements: [...currentProgress.achievements, ...newAchievements],
    },
    leveledUp,
    newAchievements,
  }
}
