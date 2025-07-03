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
            <button 
              type="button" 
              className="text-gray-500 hover:text-gray-600 lg:hidden" 
              onClick={toggleSidebar}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
              <div className="h-8 w-8 bg-gray-900 rounded-md flex items-center justify-center text-white font-medium mr-2">
                C
              </div>
              <span className="text-lg font-semibold">ContractAI</span>
            </Link>
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
                    {user?.firstname?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </span>
                </div>
                
                {/* User name with fallback */}
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                  {user?.firstname || user?.email || "User"}
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