import React from "react"

export const Alert = ({ children, variant = "default", className = "", ...props }) => {
  const variants = {
    default: "bg-blue-500/10 border-blue-500/50 text-blue-400",
    destructive: "bg-red-500/10 border-red-500/50 text-red-400"
  }

  return (
    <div
      className={`p-4 rounded-lg border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export const AlertDescription = ({ children, className = "" }) => {
  return (
    <div className={`text-sm ${className}`}>
      {children}
    </div>
  )
}
