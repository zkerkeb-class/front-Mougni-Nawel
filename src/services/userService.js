/**
 * Service for user profile management
 */

const BDD_API_URL = process.env.REACT_APP_API_URL

/**
 * Get user statistics
 * @returns {Promise<Object>} User statistics
 */
export async function getUserStats() {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${BDD_API_URL}/user/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to get user stats")
    }

    return data
  } catch (error) {
    console.error("Error getting user stats:", error)
    throw error
  }
}

/**
 * Get user activity history
 * @param {string} userId User ID
 * @param {string} filter Activity filter
 * @returns {Promise<Object>} User activity history
 */
export async function getUserActivity(userId, filter = "all") {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("No authentication token found")
    }

    const queryParams = new URLSearchParams()
    if (filter !== "all") {
      queryParams.append("type", filter)
    }

    const response = await fetch(`${BDD_API_URL}/user/${userId}/activity?${queryParams}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to get user activity")
    }

    return data
  } catch (error) {
    console.error("Error getting user activity:", error)
    throw error
  }
}

/**
 * Log user activity
 * @param {string} type Activity type
 * @param {Object} details Activity details
 * @returns {Promise<Object>} Log response
 */
export async function logActivity(type, details = {}) {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      return // Don't throw error for logging
    }

    const response = await fetch(`${BDD_API_URL}/user/activity`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        details: {
          ...details,
          ip: await getUserIP(),
          userAgent: navigator.userAgent,
        },
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error logging activity:", error)
    // Don't throw error for logging
  }
}

/**
 * Get user IP address
 * @returns {Promise<string>} User IP address
 */
async function getUserIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json")
    const data = await response.json()
    return data.ip
  } catch (error) {
    return "Unknown"
  }
}

/**
 * Change user password
 * @param {string} currentPassword Current password
 * @param {string} newPassword New password
 * @returns {Promise<Object>} Change password response
 */
export async function changePassword(currentPassword, newPassword) {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${BDD_API_URL}/user/change-password`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to change password")
    }

    return data
  } catch (error) {
    console.error("Error changing password:", error)
    throw error
  }
}

/**
 * Export user data
 * @returns {Promise<Blob>} User data export
 */
export async function exportUserData() {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${BDD_API_URL}/user/export`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Failed to export user data")
    }

    return await response.blob()
  } catch (error) {
    console.error("Error exporting user data:", error)
    throw error
  }
}

/**
 * Delete user account
 * @param {string} password User password for confirmation
 * @returns {Promise<Object>} Delete response
 */
export async function deleteUserAccount(password) {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${BDD_API_URL}/user/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete account")
    }

    // Clear localStorage after successful deletion
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    return data
  } catch (error) {
    console.error("Error deleting user account:", error)
    throw error
  }
}
