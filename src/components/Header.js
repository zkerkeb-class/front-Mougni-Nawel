"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../helpers/useAuth"

function Header({ toggleSidebar }) {
  const { user, logout, isLoading } = useAuth()

  // Display loading state if auth is still checking
  if (isLoading) {
    return (
      <header className="bg-white border-b border-gray-200 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>Loading user data...</div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white border-b border-gray-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            
          </div>
          
          <div className="flex items-center">
            {/* Notification icon */}
            <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            {/* User profile section */}
            <div className="ml-3 relative">
              <div className="flex items-center">
                {/* User avatar with fallback */}
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user?.data?.firstname?.charAt(0) || user?.data?.email?.charAt(0) || "U"}
                  </span>
                </div>
                
                {/* User name with fallback */}
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                  {user?.data?.firstname || user?.data?.email || "User"}
                </span>
                
                {/* Logout button */}
                <button 
                  onClick={logout} 
                  className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header