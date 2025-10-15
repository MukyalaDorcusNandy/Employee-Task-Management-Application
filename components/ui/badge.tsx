// components/ui/badge.tsx
import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
  size?: "sm" | "default"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center rounded-full border font-semibold transition-colors"
    
    const sizeStyles = {
      sm: "px-2 py-0.5 text-xs",
      default: "px-2.5 py-0.5 text-xs"
    }
    
    const variantStyles = {
      default: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
      secondary: "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200",
      destructive: "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
      outline: "text-gray-800 border-gray-300",
      success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
      warning: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    }

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className || ""}`}
        {...props}
      />
    )
  }
)

Badge.displayName = "Badge"

export { Badge }