import React from "react"

export function Progress({ value, className = "" }) {
  return (
    <div className={`w-full bg-slate-700 rounded-full h-2 ${className}`}>
      <div 
        className="bg-blue-500 h-2 rounded-full transition-all"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  )
}
