
/**
 * Service for authentication-related API calls
 */

const AUTH_API_URL = process.env.REACT_APP_API_AUTH;
const BDD_API_URL = process.env.REACT_APP_API_URL;

/**
 * Login user
 * @param {string} email User email
 * @param {string} password User password
 * @returns {Promise<Object>} Login response with token and user data
 */
export async function login(email, password) {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    const response = await fetch(`${AUTH_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }

    // Store token in localStorage
    if (data.success && data.data.token) {
      localStorage.setItem("token", data.data.token)
      localStorage.setItem("user", JSON.stringify(data.data.user))
    }

    return data
  } catch (error) {
    console.error("Error during login:", error)
    throw error
  }
}

/**
 * Register new user
 * @param {Object} userData User registration data
 * @returns {Promise<Object>} Registration response
 */
export async function register(userData) {
  try {
    const { email, password, firstname, lastname } = userData

    if (!email || !password || !firstname || !lastname) {
      throw new Error("All fields are required")
    }

    const response = await fetch(`${AUTH_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: { email, password, firstname, lastname } }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Registration failed")
    }

    // Store token in localStorage if registration successful
    if (data.success && data.data.token) {
      localStorage.setItem("token", data.data.token)
      localStorage.setItem("user", JSON.stringify(data.data.user))
    }

    return data
  } catch (error) {
    console.error("Error during registration:", error)
    throw error
  }
}

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile data
 */
export async function getCurrentUser() {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${AUTH_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
      throw new Error(data.message || "Failed to get user profile")
    }

    if (data.success && data.data) {
      localStorage.setItem("user", JSON.stringify(data.data))
    }

    return data
  } catch (error) {
    console.error("Error getting current user:", error)
    throw error
  }
}

/**
 * Update user profile
 * @param {string} userId User ID
 * @param {Object} userData Updated user data
 * @returns {Promise<Object>} Updated user data
 */
export async function updateUserProfile(userId, userData) {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${BDD_API_URL}/user/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile")
    }

    if (data.success && data.data) {
      localStorage.setItem("user", JSON.stringify(data.data))
    }

    return data
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

/**
 * Logout user
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    const token = localStorage.getItem("token")

    if (token) {
      await fetch(`${AUTH_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
    }
  } catch (error) {
    console.error("Error during logout:", error)
  } finally {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export function isAuthenticated() {
  const token = localStorage.getItem("token")
  return !!token
}

/**
 * Get stored user data
 * @returns {Object|null} User data or null
 */
export function getStoredUser() {
  try {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error("Error parsing stored user data:", error)
    return null
  }
}

/**
 * Google OAuth login
 * @returns {void} Redirects to Google OAuth
 */
export function loginWithGoogle() {
  window.location.href = `${AUTH_API_URL}/googleAuth/google`
}
