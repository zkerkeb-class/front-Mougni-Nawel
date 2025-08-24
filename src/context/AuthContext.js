"use client"

import { createContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => { },
  register: async () => { },
  logout: () => { },
  checkAuth: async () => { },
})



export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setUser(null)
          setIsLoading(false)
          return
        }

        const response = await fetch(`${process.env.REACT_APP_API_AUTH}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()

          setUser(data)

        } else {
          localStorage.removeItem("token")
          setUser(null)
        }
      } catch (error) {
        localStorage.removeItem("token")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
  useEffect(() => {


    checkAuth()
  }, [])


  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_AUTH}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) setUser(await response.json());
    } catch (error) {
      console.error("Refresh error:", error);
    }
  };


  const login = async (email, password) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_AUTH}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      localStorage.setItem("token", data.data.token)
      checkAuth();
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (user) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_AUTH}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({user}),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }
      const data = await response.json()

      localStorage.setItem("token", data.data.token)
      checkAuth();
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
