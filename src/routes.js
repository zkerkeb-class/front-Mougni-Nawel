"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "./helpers/useAuth"

import MainLayout from "./components/MainLayout"

import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import UploadPage from "./pages/UploadPage"
import ContractDetailPage from "./pages/ContractDetailPage"
import SettingsPage from "./pages/SettingsPage"
import NotFoundPage from "./pages/NotFoundPage"
import AuthCallback from "./pages/AuthCallback"
import Success from "./pages/Success"
import ContractsPage from "./pages/ContractsPage"
import ProfilPage from "./pages/ProfilPage"
import SecuritySettings from "./components/SecuritySettings"
import LandingPage from "./pages/LandingPage"

const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export const routes = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/success",
    element: <Success />,
  },
  {
    path:"/auth/callback",
    element: <AuthCallback />
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  // Protected routes
  {
    path: "/",
    element: (
      // <AuthGuard>
        <MainLayout />
      // </AuthGuard>
    ),
    children: [
      { path: "", element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "upload", element: <UploadPage /> },
      { path: "contracts/:id", element: <ContractDetailPage /> },
      { path: "contracts", element: <ContractsPage /> },
      { path: "settings", element: <ProfilPage /> },
    ],
  },

  // 404 route
  { path: "*", element: <NotFoundPage /> },
]
