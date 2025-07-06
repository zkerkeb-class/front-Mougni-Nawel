// /**
//  * Service for authentication-related API calls
//  */

// // Base API URL - Corrigé pour correspondre à votre API
// const API_URL = process.env.REACT_APP_API_AUTH;

// /**
//  * Login a user
//  * @param {string} email User email
//  * @param {string} password User password
//  * @returns {Promise<Object>} User data and token
//  */
// export async function login(email, password) {
//   try {
//     const response = await fetch(`${API_URL}/auth/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//     })

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}))
//       throw new Error(errorData.message || "Login failed")
//     }

//     const data = await response.json()

//     // Store token in localStorage - Corrigé pour correspondre à la structure de réponse
//     if (data.success && data.data && data.data.token) {
//       localStorage.setItem("token", data.data.token)
//     }

//     return data
//   } catch (error) {
//     console.error("Login error:", error)
//     throw error
//   }
// }

// /**
//  * Register a new user
//  * @param {string} firstname User firstname
//  * @param {string} lastname User lastname
//  * @param {string} email User email
//  * @param {string} password User password
//  * @returns {Promise<Object>} User data and token
//  */
// export async function register(firstname, lastname, email, password) {
//   try {
//     console.log('test 10 la : ');

//     const response = await fetch(`${API_URL}/auth/register`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ 
//         user: {
//           firstname,
//           lastname,
//           email,
//           password
//         }
//       }),
//     })
//     console.log('test 10 : ', response.ok);

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}))
//       throw new Error(errorData.message || "Registration failed")
//     }

//     const data = await response.json()
//     console.log('test 10 token : ', data.data.token);
//     // Store token in localStorage - Corrigé pour correspondre à la structure de réponse
//     if (data.success && data.data && data.data.token) {
//       localStorage.setItem("token", data.data.token)
//     }

//     return data
//   } catch (error) {
//     console.error("Registration error:", error)
//     throw error
//   }
// }

// /**
//  * Register a new user (version compatible avec l'ancienne signature)
//  * @param {string} name User full name (will be split into firstname/lastname)
//  * @param {string} email User email
//  * @param {string} password User password
//  * @returns {Promise<Object>} User data and token
//  */
// export async function registerWithName(name, email, password) {
//   const nameParts = name.trim().split(' ')
//   const firstname = nameParts[0] || ''
//   const lastname = nameParts.slice(1).join(' ') || ''
  
//   return register(firstname, lastname, email, password)
// }

// /**
//  * Logout the current user
//  */
// export function logout() {
//   localStorage.removeItem("token")
// }

// /**
//  * Get the current user profile
//  * @returns {Promise<Object>} User profile data
//  */
// export async function getCurrentUser() {
//   try {
//     const token = localStorage.getItem("token")

//     if (!token) {
//       return null
//     }

//     // Validation du token côté client
//     if (token === 'undefined' || token === 'null' || token.trim() === '') {
//       localStorage.removeItem("token")
//       return null
//     }

//     const response = await fetch(`${API_URL}/auth/me`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })

//     if (!response.ok) {
//       if (response.status === 401) {
//         // Token expired or invalid
//         localStorage.removeItem("token")
//         return null
//       }
//       throw new Error("Failed to get user profile")
//     }

//     const data = await response.json()
    
//     // Retourner les données utilisateur selon la structure de réponse
//     return data.success ? data.data : data
//   } catch (error) {
//     console.error("Error getting current user:", error)
    
//     // Si erreur de token, nettoyer le localStorage
//     if (error.message.includes('token') || error.message.includes('jwt')) {
//       localStorage.removeItem("token")
//     }
    
//     throw error
//   }
// }

// /**
//  * Update user profile
//  * @param {Object} updates Profile updates
//  * @returns {Promise<Object>} Updated user profile
//  */
// export async function updateProfile(updates) {
//   try {
//     const token = localStorage.getItem("token")
    
//     if (!token) {
//       throw new Error("No authentication token found")
//     }

//     const response = await fetch(`${API_URL}/auth/profile`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(updates),
//     })

//     if (!response.ok) {
//       if (response.status === 401) {
//         localStorage.removeItem("token")
//         throw new Error("Authentication expired")
//       }
//       throw new Error("Failed to update profile")
//     }

//     const data = await response.json()
//     return data.success ? data.data : data
//   } catch (error) {
//     console.error("Error updating profile:", error)
//     throw error
//   }
// }

// /**
//  * Change user password
//  * @param {string} currentPassword Current password
//  * @param {string} newPassword New password
//  * @returns {Promise<boolean>} Success status
//  */
// export async function changePassword(currentPassword, newPassword) {
//   try {
//     const token = localStorage.getItem("token")
    
//     if (!token) {
//       throw new Error("No authentication token found")
//     }

//     const response = await fetch(`${API_URL}/auth/change-password`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ currentPassword, newPassword }),
//     })

//     if (!response.ok) {
//       if (response.status === 401) {
//         localStorage.removeItem("token")
//         throw new Error("Authentication expired")
//       }
      
//       const errorData = await response.json().catch(() => ({}))
//       throw new Error(errorData.message || "Failed to change password")
//     }

//     return true
//   } catch (error) {
//     console.error("Error changing password:", error)
//     throw error
//   }
// }

// /**
//  * Utility function to check if user is authenticated
//  * @returns {boolean} Authentication status
//  */
// export function isAuthenticated() {
//   const token = localStorage.getItem("token")
//   return token && token !== 'undefined' && token !== 'null' && token.trim() !== ''
// }

// /**
//  * Utility function to get token from localStorage
//  * @returns {string|null} Token or null
//  */
// export function getToken() {
//   const token = localStorage.getItem("token")
//   return (token && token !== 'undefined' && token !== 'null' && token.trim() !== '') ? token : null
// }

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

    console.log("Registering user:", { email, firstname, lastname })

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

    console.log("Registration successful:", data)
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
      // If token is invalid, clear localStorage
      if (response.status === 401) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
      throw new Error(data.message || "Failed to get user profile")
    }

    // Update stored user data
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

    // Update stored user data
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
      // Call logout endpoint
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
    // Always clear localStorage
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
