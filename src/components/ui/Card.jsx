import React from "react"

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-slate-800 rounded-lg border border-slate-700 ${className}`}>
      {children}
    </div>
  )
}
