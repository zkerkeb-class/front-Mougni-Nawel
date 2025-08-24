function LoadingSpinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-[3px]",
    lg: "w-8 h-8 border-4",
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-[3px] border-silver border-t-royalblue rounded-full animate-spin`}
        style={{
          borderColor: "#c0c0c0",
          borderTopColor: "#4169e1",
        }}
      />
    </div>
  )
}

export default LoadingSpinner
