/**
 * Format a date object or string into a readable format
 * @param {Date|string} date - The date to format
 * @param {string} format - The format to use (default: 'short')
 * @returns {string} - The formatted date string
 */
export function formatDate(date, format = "short") {
  if (!date) return ""

  const dateObj = typeof date === "string" ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    return ""
  }

  switch (format) {
    case "short":
      return dateObj.toLocaleDateString()
    case "long":
      return dateObj.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    case "time":
      return dateObj.toLocaleTimeString()
    case "datetime":
      return dateObj.toLocaleString()
    default:
      return dateObj.toLocaleDateString()
  }
}
