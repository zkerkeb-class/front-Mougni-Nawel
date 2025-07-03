"use client"

function Step({ title, description, icon, isActive, isCompleted, onClick, disabled = false }) {
  return (
    <div
      className={`flex flex-col items-center text-center ${onClick && !disabled ? "cursor-pointer" : ""} ${
        disabled ? "opacity-50" : ""
      }`}
      onClick={() => !disabled && onClick?.()}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
          isActive ? "bg-gray-900 text-white" : isCompleted ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"
        }`}
      >
        {isCompleted ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          icon || <span>{title[0]}</span>
        )}
      </div>
      <div className="space-y-1">
        <div className="font-medium">{title}</div>
        {description && <div className="text-xs text-gray-500">{description}</div>}
      </div>
    </div>
  )
}

function Stepper({ steps, currentStep, onChange, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      {/* Connector line */}
      <div className="absolute top-5 left-0 right-0 h-[2px] bg-gray-100 -z-10" />

      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex-1">
            <Step
              {...step}
              isActive={currentStep === index}
              isCompleted={currentStep > index}
              onClick={() => onChange?.(index)}
              disabled={index > currentStep + 1}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stepper
