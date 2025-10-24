import React from "react"
import { Link, useLocation } from "react-router-dom"

export default function Layout({ children }) {
  const location = useLocation()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <nav className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Emotion Detector
              </Link>
            </div>
            <div className="flex space-x-8">
              <Link 
                to="/scanner" 
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/' || location.pathname === '/scanner' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Scanner
              </Link>
              <Link 
                to="/history" 
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/history' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                History
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
