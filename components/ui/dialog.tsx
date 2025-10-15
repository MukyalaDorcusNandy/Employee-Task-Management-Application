"use client"

import * as React from "react"
import { createContext, useContext, useState } from "react"

interface DialogContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {open && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          {children}
        </div>
      )}
    </DialogContext.Provider>
  )
}

interface DialogContentProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export function DialogContent({ children, style }: DialogContentProps) {
  const context = useContext(DialogContext)

  const contentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    maxWidth: '500px',
    width: '90vw',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
    ...style
  }

  return (
    <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  )
}

interface DialogHeaderProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export function DialogHeader({ children, style }: DialogHeaderProps) {
  const headerStyle: React.CSSProperties = {
    padding: '20px 20px 0',
    ...style
  }

  return <div style={headerStyle}>{children}</div>
}

interface DialogTitleProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export function DialogTitle({ children, style }: DialogTitleProps) {
  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    color: '#333',
    ...style
  }

  return <h2 style={titleStyle}>{children}</h2>
}

interface DialogFooterProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export function DialogFooter({ children, style }: DialogFooterProps) {
  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    padding: '16px 20px 20px',
    borderTop: '1px solid #eee',
    ...style
  }

  return <div style={footerStyle}>{children}</div>
}