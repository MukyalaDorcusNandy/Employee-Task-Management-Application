/**
 * Achievements panel showing unlocked and locked achievements
 */

"use client"

import type { UserProgress } from "@/lib/types"
import { ACHIEVEMENTS_CONFIG } from "@/lib/types"
import { Award, Lock } from "lucide-react"

interface AchievementsPanelProps {
  progress: UserProgress
}

export function AchievementsPanel({ progress }: AchievementsPanelProps) {
  const unlockedIds = new Set(progress.achievements.map((a) => a.id))

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Achievements</h3>
        <span className="text-sm text-muted-foreground ml-auto">
          {progress.achievements.length} / {ACHIEVEMENTS_CONFIG.length}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ACHIEVEMENTS_CONFIG.map((config) => {
          const isUnlocked = unlockedIds.has(config.id)

          return (
            <div
              key={config.id}
              className={`
                relative rounded-lg p-3 text-center transition-all
                ${
                  isUnlocked
                    ? "bg-primary/10 border-2 border-primary/30"
                    : "bg-muted/50 border border-border opacity-50"
                }
              `}
            >
              <div className="text-3xl mb-2">
                {isUnlocked ? config.icon : <Lock className="h-8 w-8 mx-auto text-muted-foreground" />}
              </div>
              <p className="text-xs font-medium text-foreground line-clamp-1">{config.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{config.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
