"use client"
import { NavLink } from "react-router-dom"
import { loadStripe } from '@stripe/stripe-js'
import { useEffect } from "react"

function Sidebar({ isOpen, toggleSidebar, user }) {
  const handleSubscribe = async () => {
    console.log('ye : ', process.env.REACT_APP_STRIPE_PUBLIC_KEY)
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_PAYMENT}/stripe/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const { sessionId } = await response.json()
      await stripe.redirectToCheckout({ sessionId })
    } catch (err) {
      console.error('Subscription error:', err)
    }
  }

  const navItems = [
    { name: "Dashboard", icon: "home", path: "/dashboard" },
    { name: "Upload Contract", icon: "upload", path: "/upload" },
    { name: "My Contracts", icon: "file-text", path: "/contracts" },
    { name: "Settings", icon: "settings", path: "/settings" },
  ]

  useEffect(() => {
    console.log('usus : ', user);
  })

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gray-900 rounded-md flex items-center justify-center text-white font-medium mr-2">
              C
            </div>
            <span className="text-lg font-semibold">ContractAI</span>
          </div>
          <button className="lg:hidden text-gray-500 hover:text-gray-600" onClick={toggleSidebar}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <span className="mr-3">
                  <i className={`icon-${item.icon}`}></i>
                </span>
                {item.name}
              </NavLink>
            ))}

            {/* Bouton d'abonnement */}
            <div className="px-4 pt-4 border-t border-gray-200 mt-4">
              {user?.typeAbonnement === 'free' ? (
                <button
                  onClick={handleSubscribe}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  Upgrade to Premium
                </button>
              ) : (
                <div className="text-center py-2 px-4 bg-green-50 text-green-700 rounded-md text-sm font-medium">
                  Premium Member
                </div>
              )}
              
              {user?.typeAbonnement === 'free' && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {3 - (user?.analysisCount || 0)} analyses remaining
                </p>
              )}
            </div>
          </nav>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar