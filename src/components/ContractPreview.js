"use client"

import { useState } from "react"
import Button from "./Button"
import SensitiveDataDetector from "./SensitiveDataDetector"

function ContractPreview({ contractData, onEdit, onSubmit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(contractData?.content || "")

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    onEdit({
      ...contractData,
      content: editedContent,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedContent(contractData.content)
    setIsEditing(false)
  }

  const handleMaskAll = () => {
    if (!contractData || !contractData.sensitiveItems) return

    let newContent = contractData.content

    // Sort items by index in descending order to avoid offset issues when replacing
    const sortedItems = [...contractData.sensitiveItems].sort((a, b) => b.index - a.index)

    sortedItems.forEach((item) => {
      const mask = "X".repeat(item.length)
      newContent = newContent.substring(0, item.index) + mask + newContent.substring(item.index + item.length)
    })

    setEditedContent(newContent)
    onEdit({
      ...contractData,
      content: newContent,
    })
  }

  if (!contractData) {
    return <div>No contract data available</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold">{isEditing ? "Edit Contract" : "Contract Preview"}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{new Date(contractData.uploadDate).toLocaleDateString()}</span>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
            {contractData.fileType?.split("/")[1]?.toUpperCase() || "TXT"}
          </span>
        </div>
      </div>

      <SensitiveDataDetector contractData={contractData} onMaskAll={handleMaskAll} className="mb-6" />

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full min-h-[400px] p-4 font-mono text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg border border-gray-100 max-h-[500px] overflow-y-auto">
            {contractData.content}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleEdit}>
              Edit Content
            </Button>
            <Button variant="primary" onClick={onSubmit}>
              Continue to Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContractPreview
