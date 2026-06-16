import React, { useState, useEffect } from "react";
import Chatbot from "./components/Chatbot";
import AdminPanel from "./components/AdminPanel";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

function App() {
  const [tab, setTab] = useState("chat");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-brand-darkBg dark:text-slate-100 transition-colors duration-200">
      <header className="sticky top-0 z-50 bg-white dark:bg-brand-darkCard border-b border-slate-200 dark:border-brand-darkBorder shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-orange to-brand-green flex items-center justify-center text-white font-bold text-xl shadow-md">
              NP
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-brand-orange to-brand-green bg-clip-text text-transparent">
                NayePankh Foundation
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Official Virtual Assistant</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-1 sm:space-x-4">
            <button
              onClick={() => setTab("chat")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                tab === "chat"
                  ? "bg-brand-green text-white shadow"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Chatbot
            </button>
            <button
              onClick={() => setTab("admin")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                tab === "admin"
                  ? "bg-brand-green text-white shadow"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Admin Panel
            </button>
            <button
              onClick={() => setTab("analytics")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                tab === "analytics"
                  ? "bg-brand-green text-white shadow"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Analytics
            </button>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-2"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {tab === "chat" && <Chatbot />}
        {tab === "admin" && <AdminPanel />}
        {tab === "analytics" && <AnalyticsDashboard />}
      </main>

      <footer className="bg-white dark:bg-brand-darkCard border-t border-slate-200 dark:border-brand-darkBorder py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© {new Date().getFullYear()} NayePankh Foundation. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
