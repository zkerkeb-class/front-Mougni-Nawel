"use client"

function Input({
  type = "text",
  label,
  id,
  name,
  placeholder,
  error,
  helperText,
  fullWidth = false,
  className = "",
  value,
  onChange,
  ...props
}) {
  const widthClass = fullWidth ? "w-full" : ""

  return (
    <div className={`${widthClass}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name || id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
          error ? "border-red-300" : "border-gray-300"
        } ${widthClass} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  )
}

export default Input
