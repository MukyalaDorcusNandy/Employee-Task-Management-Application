// components/ui/select.tsx
"use client"

import * as React from "react"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
}

interface SelectValueProps {
  placeholder?: string
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

const SelectContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}>({
  value: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
})

const Select = ({ value = "", onValueChange = () => {}, children }: SelectProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = ({ children, className = "" }: SelectTriggerProps) => {
  const { setOpen } = React.useContext(SelectContext)

  return (
    <button
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setOpen(true)}
    >
      {children}
    </button>
  )
}

const SelectValue = ({ placeholder = "Select..." }: SelectValueProps) => {
  const { value } = React.useContext(SelectContext)

  return (
    <span className={value ? "text-gray-900" : "text-gray-500"}>
      {value || placeholder}
    </span>
  )
}

const SelectContent = ({ children, className = "" }: SelectContentProps) => {
  const { open, setOpen } = React.useContext(SelectContext)

  if (!open) return null

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={() => setOpen(false)}
      />
      <div className={`absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg ${className}`}>
        {children}
      </div>
    </>
  )
}

const SelectItem = ({ value, children, className = "" }: SelectItemProps) => {
  const { onValueChange, setOpen } = React.useContext(SelectContext)

  const handleSelect = () => {
    onValueChange(value)
    setOpen(false)
  }

  return (
    <div
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 ${className}`}
      onClick={handleSelect}
    >
      {children}
    </div>
  )
}

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}