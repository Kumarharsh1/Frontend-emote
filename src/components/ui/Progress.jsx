import React from "react"

export const Progress = ({ value = 0, className = "" }) => {
  return (
    <div className={`w-full bg-slate-700/50 rounded-full h-2 ${className}`}>
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
