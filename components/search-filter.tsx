/**
 * Search and filter component for todos
 */

"use client"

import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

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
          <Button variant="outline" size="icon" className="h-10 w-10 relative bg-transparent">
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
