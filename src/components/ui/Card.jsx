import React from "react"

export const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
