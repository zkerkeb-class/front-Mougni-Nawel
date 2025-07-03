/**
 * Service for authentication-related API calls
 */

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || "https://api.contractai.example.com"

/**
 * Login a user
 * @param {string} email User email
 * @param {string} password User password
 * @returns {Promise<Object>} User data and token
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Login failed")
    }

    const data = await response.json()

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem("token", data.token)
    }

    return data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

/**
 * Register a new user
 * @param {string} name User name
 * @param {string} email User email
 * @param {string} password User password
 * @returns {Promise<Object>} User data and token
 */
export async function register(name, email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Registration failed")
    }

    const data = await response.json()

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem("token", data.token)
    }

    return data
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

/**
 * Logout the current user
 */
export function logout() {
  localStorage.removeItem("token")
}

/**
 * Get the current user profile
 * @returns {Promise<Object>} User profile data
 */
export async function getCurrentUser() {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      return null
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token")
        return null
      }
      throw new Error("Failed to get user profile")
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting current user:", error)
    throw error
  }
}

/**
 * Update user profile
 * @param {Object} updates Profile updates
 * @returns {Promise<Object>} Updated user profile
 */
export async function updateProfile(updates) {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error("Failed to update profile")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

/**
 * Change user password
 * @param {string} currentPassword Current password
 * @param {string} newPassword New password
 * @returns {Promise<boolean>} Success status
 */
export async function changePassword(currentPassword, newPassword) {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to change password")
    }

    return true
  } catch (error) {
    console.error("Error changing password:", error)
    throw error
  }
}
