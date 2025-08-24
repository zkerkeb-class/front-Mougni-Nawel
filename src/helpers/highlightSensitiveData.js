/**
 * Highlights sensitive data in text
 * @param {string} text - The text to highlight
 * @param {Array} sensitiveItems - Array of sensitive items with index and length
 * @returns {string} - HTML string with highlighted sensitive data
 */
export function highlightSensitiveData(text, sensitiveItems) {
  if (!text || !sensitiveItems || sensitiveItems.length === 0) {
    return text
  }

  const sortedItems = [...sensitiveItems].sort((a, b) => a.index - b.index)

  let result = ""
  let lastIndex = 0

  sortedItems.forEach((item) => {
    result += text.substring(lastIndex, item.index)

    result += `<span class="bg-amber-100 text-amber-800 px-1 rounded">${text.substring(item.index, item.index + item.length)}</span>`

    lastIndex = item.index + item.length
  })

  result += text.substring(lastIndex)

  return result
}
