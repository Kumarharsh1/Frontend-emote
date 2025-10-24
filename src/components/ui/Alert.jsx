import React from "react"

export function Alert({ children, className = "" }) {
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      {children}
    </div>
  )
}
