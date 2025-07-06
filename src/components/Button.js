"use client"

function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  isLoading = false,
  loadingText = "Loading...",
  icon,
  fullWidth = false,
  type = "button",
  onClick,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary: "bg-gray-800 hover:bg-gray-700 text-white shadow-sm hover:shadow-md",
    secondary: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md",
    metallic: "bg-gradient-to-br from-gray-200 to-gray-400 text-gray-800 border border-gray-300 hover:from-gray-300 hover:to-gray-500 shadow-sm hover:shadow-md",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md",
    success: "bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md",
    warning: "bg-amber-400 hover:bg-amber-500 text-gray-800 shadow-sm hover:shadow-md"
  }

  const sizes = {
    sm: "py-1.5 px-3 text-xs",
    md: "py-2 px-4 text-sm",
    lg: "py-3 px-6 text-base",
    xl: "py-4 px-8 text-lg"
  }

  const widthClass = fullWidth ? "w-full" : ""

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}

export default Button