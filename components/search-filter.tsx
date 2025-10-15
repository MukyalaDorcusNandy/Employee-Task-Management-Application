/**
 * Search and filter component for todos
 */

"use client"

import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import React, { createContext, useContext, useState, ReactNode, isValidElement, cloneElement } from "react"

type PopoverContextType = {
  open: boolean
  setOpen: (open: boolean) => void
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined)

/**
 * Minimal Popover implementation used locally to avoid a missing module error.
 * This replicates the small API used by the component: <Popover>, <PopoverTrigger asChild>, <PopoverContent>.
 */
export function Popover({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return <PopoverContext.Provider value={{ open, setOpen }}>{children}</PopoverContext.Provider>
}

export function PopoverTrigger({
  children,
  asChild = false,
}: {
  children: ReactNode
  asChild?: boolean
}) {
  const ctx = useContext(PopoverContext)
  if (!ctx) return null

  const handleToggle = (e?: any) => {
    ctx.setOpen(!ctx.open)
  }

  if (asChild && isValidElement(children)) {
    // Clone the child and attach an onClick that toggles the popover, preserving existing onClick.
    return cloneElement(children as any, {
      onClick: (e: any) => {
        const orig = (children as any).props.onClick
        orig && orig(e)
        handleToggle(e)
      },
    })
  }

  return <button onClick={handleToggle}>{children}</button>
}

export function PopoverContent({
  children,
  className,
  align,
}: {
  children: ReactNode
  className?: string
  align?: string
}) {
  const ctx = useContext(PopoverContext)
  if (!ctx) return null
  if (!ctx.open) return null

  // Very small helper: render content only when open; styling is driven by provided className.
  return <div className={className} data-align={align}>{children}</div>
}
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"

interface SearchFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  priorityFilter: Set<string>
  onPriorityFilterChange: (priorities: Set<string>) => void
  showOverdue: boolean
  onShowOverdueChange: (show: boolean) => void
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  showOverdue,
  onShowOverdueChange,
}: SearchFilterProps) {
  const togglePriority = (priority: string) => {
    const newFilter = new Set(priorityFilter)
    if (newFilter.has(priority)) {
      newFilter.delete(priority)
    } else {
      newFilter.add(priority)
    }
    onPriorityFilterChange(newFilter)
  }

  const hasActiveFilters = priorityFilter.size > 0 || showOverdue

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-10 w-10 relative bg-transparent">
            <SlidersHorizontal className="h-4 w-4" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-background" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="end">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-3">Filter by Priority</h4>
              <div className="space-y-2">
                {["high", "medium", "low"].map((priority) => (
                  <div key={priority} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={priorityFilter.has(priority)}
                      onCheckedChange={() => togglePriority(priority)}
                    />
                    <Label htmlFor={`priority-${priority}`} className="text-sm font-normal cursor-pointer capitalize">
                      {priority}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-overdue"
                  checked={showOverdue}
                  onCheckedChange={(checked) => onShowOverdueChange(checked === true)}
                />
                <Label htmlFor="show-overdue" className="text-sm font-normal cursor-pointer">
                  Show only overdue
                </Label>
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => {
                  onPriorityFilterChange(new Set())
                  onShowOverdueChange(false)
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
