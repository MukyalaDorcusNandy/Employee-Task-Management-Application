/**
 * Celebration modal for achievements and level ups
 */

"use client"

import { useEffect, useState } from "react"
import type { Achievement } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Sparkles, Trophy, X } from "lucide-react"

interface CelebrationModalProps {
  show: boolean
  type: "levelUp" | "achievement"
  level?: number
  achievement?: Achievement
  onClose: () => void
}

export function CelebrationModal({ show, type, level, achievement, onClose }: CelebrationModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
    }
  }, [show])

  if (!show && !isVisible) return null

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm
        transition-opacity duration-300
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
      onClick={handleClose}
    >
      <div
        className={`
          bg-gradient-to-br from-primary/20 via-background to-accent/20 
          rounded-2xl p-8 max-w-md w-full border-2 border-primary/30 shadow-2xl
          transition-all duration-300 transform
          ${isVisible ? "scale-100 rotate-0" : "scale-95 rotate-3"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            {type === "levelUp" ? (
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-bounce">
                <Sparkles className="h-10 w-10 text-primary-foreground" />
              </div>
            ) : (
              <div className="text-6xl animate-bounce">{achievement?.icon}</div>
            )}
          </div>

          {type === "levelUp" ? (
            <>
              <h2 className="text-3xl font-bold text-foreground">Level Up!</h2>
              <p className="text-xl text-muted-foreground">
                You've reached <span className="text-primary font-bold">Level {level}</span>
              </p>
              <p className="text-sm text-muted-foreground">Keep up the amazing work!</p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-foreground">Achievement Unlocked!</h2>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-primary">{achievement?.title}</p>
                <p className="text-sm text-muted-foreground">{achievement?.description}</p>
              </div>
            </>
          )}

          <Button onClick={handleClose} className="w-full mt-6" size="lg">
            <Trophy className="h-5 w-5 mr-2" />
            Awesome!
          </Button>
        </div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
