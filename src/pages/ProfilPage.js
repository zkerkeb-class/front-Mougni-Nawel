"use client"

import { useState, useEffect } from "react"
import { getCurrentUser, updateUserProfile } from "../services/authService"
import { getUserStats } from "../services/userService"
import Button from "../components/Button"
import Input from "../components/Input"
import LoadingSpinner from "../components/LoadingSpinner"
import SecuritySettings from "../components/SecuritySettings"
import ActivityHistory from "../components/ActivityHistory"

function ProfilePage() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
  })
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      const [userResponse, statsResponse] = await Promise.all([getCurrentUser(), getUserStats()])

      if (userResponse.success) {
        setUser(userResponse.data)
        setEditForm({
          firstname: userResponse.data.firstname || "",
          lastname: userResponse.data.lastname || "",
          email: userResponse.data.email || "",
        })
      }

      if (statsResponse.success) {
        setStats(statsResponse.data)
      }
    } catch (err) {
      console.error("Error loading user data:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form when canceling
      setEditForm({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
      })
    }
    setIsEditing(!isEditing)
    setUpdateSuccess(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setUpdateLoading(true)
      const response = await updateUserProfile(user._id, editForm)

      if (response.success) {
        setUser(response.data)
        setIsEditing(false)
        setUpdateSuccess("Profil mis à jour avec succès")
        setTimeout(() => setUpdateSuccess(null), 3000)
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(err.message)
    } finally {
      setUpdateLoading(false)
    }
  }

  const getInitials = (firstname, lastname) => {
    return `${firstname?.charAt(0) || ""}${lastname?.charAt(0) || ""}`.toUpperCase()
  }

  const getSubscriptionBadge = (type) => {
    const badges = {
      free: { color: "bg-gray-100 text-gray-800", label: "Gratuit" },
      premium: { color: "bg-primary-100 text-primary-800", label: "Premium" },
      enterprise: { color: "bg-purple-100 text-purple-800", label: "Enterprise" },
    }
    return badges[type] || badges.free
  }

  const tabs = [
    {
      id: "profile",
      label: "Profil",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      id: "subscription",
      label: "Abonnement",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
    },
    {
      id: "security",
      label: "Sécurité",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
    {
      id: "activity",
      label: "Activité",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={loadUserData} variant="primary">
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(user?.firstname, user?.lastname)
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {user?.firstname} {user?.lastname}
                </h1>
                <p className="text-primary-100 mb-3">{user?.email}</p>
                <div className="flex items-center space-x-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      getSubscriptionBadge(user?.typeAbonnement).color
                    }`}
                  >
                    {getSubscriptionBadge(user?.typeAbonnement).label}
                  </span>
                  <span className="text-primary-100 text-sm">
                    Membre depuis {new Date(user?.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {updateSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-800">{updateSuccess}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary-50 text-primary-700 border border-primary-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Stats Card */}
            {stats && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Contrats analysés</span>
                    <span className="font-semibold text-gray-900">{stats.totalContracts || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Analyses effectuées</span>
                    <span className="font-semibold text-gray-900">{stats.totalAnalyses || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Crédits utilisés</span>
                    <span className="font-semibold text-gray-900">{user?.analysisCount || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              {activeTab === "profile" && (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900">Informations personnelles</h2>
                    <Button
                      variant={isEditing ? "secondary" : "primary"}
                      onClick={handleEditToggle}
                      disabled={updateLoading}
                    >
                      {isEditing ? "Annuler" : "Modifier"}
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Prénom"
                        name="firstname"
                        value={editForm.firstname}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                      />
                      <Input
                        label="Nom"
                        name="lastname"
                        value={editForm.lastname}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>

                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type d'abonnement</label>
                        <div
                          className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                            getSubscriptionBadge(user?.typeAbonnement).color
                          }`}
                        >
                          {getSubscriptionBadge(user?.typeAbonnement).label}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Membre depuis</label>
                        <p className="text-gray-900">
                          {new Date(user?.createdAt).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex space-x-4 pt-6 border-t border-gray-200">
                        <Button
                          variant="primary"
                          onClick={handleSaveProfile}
                          disabled={updateLoading}
                          isLoading={updateLoading}
                        >
                          Sauvegarder
                        </Button>
                        <Button variant="secondary" onClick={handleEditToggle} disabled={updateLoading}>
                          Annuler
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "subscription" && (
                <div className="p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-8">Gestion de l'abonnement</h2>

                  <div className="space-y-8">
                    {/* Current Plan */}
                    <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-primary-900 mb-2">
                            Plan {getSubscriptionBadge(user?.typeAbonnement).label}
                          </h3>
                          <p className="text-primary-700 mb-4">
                            {user?.typeAbonnement === "free"
                              ? "Accès limité aux fonctionnalités de base"
                              : "Accès complet à toutes les fonctionnalités"}
                          </p>
                          <div className="flex items-center space-x-4">
                            <div className="text-sm text-primary-600">
                              <span className="font-medium">Analyses utilisées:</span> {user?.analysisCount || 0}
                            </div>
                            {user?.typeAbonnement === "free" && (
                              <div className="text-sm text-primary-600">
                                <span className="font-medium">Limite:</span> 10 analyses/mois
                              </div>
                            )}
                          </div>
                        </div>
                        {user?.typeAbonnement === "free" && <Button variant="primary">Passer à Premium</Button>}
                      </div>
                    </div>

                    {/* Usage Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Contrats ce mois</h4>
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stats?.monthlyContracts || 0}</div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Analyses ce mois</h4>
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stats?.monthlyAnalyses || 0}</div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Crédits restants</h4>
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                          </svg>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {user?.typeAbonnement === "free" ? "Limité" : "Illimité"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && <SecuritySettings user={user} />}

              {activeTab === "activity" && <ActivityHistory userId={user?._id} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
