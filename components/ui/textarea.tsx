"use client"

import * as React from "react"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, style, ...props }, ref) => {
    const textareaStyle: React.CSSProperties = {
      minHeight: '80px',
      width: '100%',
      borderRadius: '4px',
      border: '1px solid #ddd',
      backgroundColor: 'white',
      padding: '8px 12px',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical',
      outline: 'none',
      transition: 'border-color 0.2s',
      ...style
    }

    const focusStyle: React.CSSProperties = {
      borderColor: '#1976d2',
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
    }

    return (
      <textarea
        style={textareaStyle}
        ref={ref}
        onFocus={(e) => {
          e.target.style.borderColor = focusStyle.borderColor as string
          e.target.style.boxShadow = focusStyle.boxShadow as string
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#ddd'
          e.target.style.boxShadow = 'none'
        }}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }