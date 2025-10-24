import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Scan, History, Sparkles } from "lucide-react";

const navigationItems = [
  {
    title: "Emotion Scanner",
    url: "/scanner",
    icon: Scan,
  },
  {
    title: "History",
    url: "/history",
    icon: History,
  },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900/80 backdrop-blur-xl border-b md:border-r border-white/10 p-4 md:p-6">
        <div className="flex md:flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">EmotiSense AI</h2>
              <p className="text-xs text-slate-400">Emotion & Gender Detection</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex md:flex-col gap-2 flex-1">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  location.pathname === item.url
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* Footer in sidebar for mobile */}
          <div className="mt-auto pt-6 border-t border-white/10 md:hidden">
            <div className="text-slate-400 text-xs text-center space-y-1">
              <div>© 2025 EmotiSense AI. All rights reserved.</div>
              <div>Made by <span className="text-blue-400 font-semibold">Kumar Harsh</span></div>
              <div>
                <a href="mailto:kh949118@gmail.com" className="text-purple-400 hover:text-purple-300">
                  kh949118@gmail.com
                </a> 
                <span className="mx-1">|</span>
                <a href="tel:9279157296" className="text-green-400 hover:text-green-300">
                  9279157296
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-slate-950/30 backdrop-blur-xl border-b border-white/10 px-6 py-4 md:hidden">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">EmotiSense AI</h1>
          </div>
        </header>

        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          {children}
        </main>

        {/* Footer for desktop - Fixed at bottom */}
        <footer className="hidden md:block border-t border-white/10 bg-slate-900/80 backdrop-blur-xl py-4 mt-auto">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-2 md:space-y-0">
              <div className="text-slate-400 text-sm">
                © 2025 EmotiSense AI. All rights reserved.
              </div>
              <div className="text-slate-400 text-sm">
                Made by <span className="text-blue-400 font-semibold">Kumar Harsh</span> | 
                <a href="mailto:kh949118@gmail.com" className="text-purple-400 hover:text-purple-300 ml-1">
                  kh949118@gmail.com
                </a> | 
                <a href="tel:9279157296" className="text-green-400 hover:text-green-300 ml-1">
                  9279157296
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
