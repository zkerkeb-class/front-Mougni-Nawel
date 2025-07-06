"use client"
import { NavLink } from "react-router-dom"
import { loadStripe } from '@stripe/stripe-js'
import { useEffect } from "react"
import { FaBalanceScale } from "react-icons/fa"

function Sidebar({ isOpen, toggleSidebar, user }) {
  const handleSubscribe = async () => {
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_PAYMENT}/stripe/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const res = await response.json()
      const sessionId = res.data.sessionId
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
    console.log('User data:', user)
  }, [user])

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center select-none cursor-default">
            <div className="h-9 w-9 rounded-md flex items-center justify-center font-semibold text-gray-800 bg-transparent mr-3">
              <FaBalanceScale size={20} />
            </div>
            <span className="text-lg font-semibold text-gray-800 tracking-wide">
              ContractAI
            </span>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors duration-200"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-5 px-4 space-y-1 text-gray-700">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-gray-900 font-semibold border-l-4 border-silver-400"
                    : "hover:text-gray-900 hover:bg-gray-50"
                }`
              }
            >
              <span className="mr-3 text-gray-400">
                <i className={`icon-${item.icon}`}></i>
              </span>
              {item.name}
            </NavLink>
          ))}

          <div className="pt-6 border-t border-gray-200 mt-6">
            {user?.data?.typeAbonnement === 'free' ? (
              <button
                onClick={handleSubscribe}
                className="w-full py-2 px-4 rounded-md text-white text-sm font-semibold shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #203864, #AFAFAF)',
                  boxShadow: '0 2px 6px rgba(32, 56, 100, 0.5)',
                }}
              >
                Upgrade to Premium
              </button>
            ) : (
              <div className="text-center py-2 px-4 bg-green-50 text-green-700 rounded-md text-sm font-medium select-none">
                Premium Member
              </div>
            )}

            {user?.typeAbonnement === 'free' && (
              <p className="text-xs text-gray-400 mt-2 text-center select-none">
                {3 - (user?.analysisCount || 0)} analyses remaining
              </p>
            )}
          </div>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar