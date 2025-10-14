/**
 * Progress header showing XP, level, and streak
 */

"use client"

import type { UserProgress } from "@/lib/types"
import { calculateLevelProgress } from "@/lib/gamification"
import { Trophy, Flame, Star } from "lucide-react"

interface ProgressHeaderProps {
  progress: UserProgress
}

export function ProgressHeader({ progress }: ProgressHeaderProps) {
  const levelProgress = calculateLevelProgress(progress.xp)

  return (
    <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl p-6 mb-8 border border-primary/20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            {progress.level}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Level {progress.level}</h2>
            <p className="text-sm text-muted-foreground">Task Master</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-background/50 rounded-lg px-3 py-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">XP</p>
              <p className="text-sm font-bold text-foreground">{progress.xp}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-background/50 rounded-lg px-3 py-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Streak</p>
              <p className="text-sm font-bold text-foreground">{progress.streak} days</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-background/50 rounded-lg px-3 py-2">
            <Trophy className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Tasks</p>
              <p className="text-sm font-bold text-foreground">{progress.totalTasksCompleted}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress to Level {progress.level + 1}</span>
          <span className="font-medium text-foreground">
            {levelProgress.current} / {levelProgress.required} XP
          </span>
        </div>
        <div className="h-3 bg-background/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
            style={{ width: `${levelProgress.percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
