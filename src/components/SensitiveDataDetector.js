import { useState } from "react"

function SensitiveDataDetector({ contractData, onMaskAll, className }) {
  const { sensitiveItems = [] } = contractData || {}
  const [expanded, setExpanded] = useState(sensitiveItems.length > 0)

  if (!sensitiveItems || sensitiveItems.length === 0) {
    return (
      <div className={`p-4 bg-green-50 border border-green-200 rounded-lg ${className || ""}`}>
        <div className="flex items-center">
          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium text-green-800">No sensitive data detected</span>
        </div>
      </div>
    )
  }

  const itemsByType = sensitiveItems.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = []
    }
    acc[item.type].push(item)
    return acc
  }, {})

  return (
    <div className={`border border-amber-200 rounded-lg overflow-hidden ${className || ""}`}>
      <div
        className="p-4 bg-amber-50 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <svg className="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <span className="font-medium text-amber-800">
              {sensitiveItems.length} sensitive {sensitiveItems.length === 1 ? "item" : "items"} detected
            </span>
            <span className="text-sm text-amber-700 ml-2">(click to {expanded ? "hide" : "view"})</span>
          </div>
        </div>
        <button
          className="px-3 py-1 text-sm font-medium text-amber-800 bg-amber-100 rounded-md hover:bg-amber-200"
          onClick={(e) => {
            e.stopPropagation()
            onMaskAll()
          }}
        >
          Mask All
        </button>
      </div>

      {expanded && (
        <div className="p-4 bg-white border-t border-amber-200">
          <div className="space-y-4">
            {Object.entries(itemsByType).map(([type, items]) => (
              <div key={type}>
                <h4 className="font-medium text-gray-700 mb-2">
                  {type} ({items.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {items.map((item, index) => {
                    const contextStart = Math.max(0, item.index - 10)
                    const contextEnd = Math.min(contractData.content.length, item.index + item.length + 10)
                    
                    const beforeContext = contractData.content.substring(contextStart, item.index)
                    const sensitiveText = contractData.content.substring(item.index, item.index + item.length)
                    const afterContext = contractData.content.substring(item.index + item.length, contextEnd)
                    
                    return (
                      <div key={index} className="p-3 bg-gray-50 rounded border border-gray-100 text-sm">
                        <div className="text-gray-500">
                          {beforeContext}
                          <span className="bg-amber-100 text-amber-800 font-medium px-1 rounded">
                            {sensitiveText}
                          </span>
                          {afterContext}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Click "Mask All" to replace all sensitive data with X's, or edit the contract text manually.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SensitiveDataDetector;