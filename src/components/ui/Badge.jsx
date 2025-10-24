import React from "react"

export const Badge = ({ children, className = "", variant = "default", ...props }) => {
  const variants = {
    default: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    secondary: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    destructive: "bg-red-500/20 text-red-400 border-red-500/30"
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
