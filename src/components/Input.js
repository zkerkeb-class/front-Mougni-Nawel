// "use client"

// function Input({
//   type = "text",
//   label,
//   id,
//   name,
//   placeholder,
//   error,
//   helperText,
//   fullWidth = false,
//   className = "",
//   value,
//   onChange,
//   ...props
// }) {
//   const widthClass = fullWidth ? "w-full" : ""

//   return (
//     <div className={`${widthClass}`}>
//       {label && (
//         <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
//           {label}
//         </label>
//       )}
//       <input
//         type={type}
//         id={id}
//         name={name || id}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
//           error ? "border-red-300" : "border-gray-300"
//         } ${widthClass} ${className}`}
//         {...props}
//       />
//       {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//       {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
//     </div>
//   )
// }

// export default Input
"use client"

import { forwardRef } from "react"

const Input = forwardRef(function Input(
  { label, error, helperText, icon, className = "", fullWidth = false, required = false, disabled = false, ...props },
  ref,
) {
  const baseClasses =
    "block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"

  const errorClasses = error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""
  const disabledClasses = disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white"

  const inputClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}

        <input ref={ref} className={icon ? `${inputClasses} pl-10` : inputClasses} disabled={disabled} {...props} />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  )
})

export default Input
