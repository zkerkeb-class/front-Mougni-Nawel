"use client"

import { useState } from "react"
import Button from "./Button"
import Input from "./Input"

function SecuritySettings({ user }) {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState(null)
  const [passwordSuccess, setPasswordSuccess] = useState(null)

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    setPasswordError(null)
  }

  const handlePasswordSubmit = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas")
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères")
      return
    }

    try {
      setPasswordSuccess("Mot de passe modifié avec succès")
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setIsChangingPassword(false)
      setTimeout(() => setPasswordSuccess(null), 3000)
    } catch (error) {
      setPasswordError("Erreur lors du changement de mot de passe")
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900">Sécurité du compte</h2>

      {passwordSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-green-800">{passwordSuccess}</span>
          </div>
        </div>
      )}

      {passwordError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-800">{passwordError}</span>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Mot de passe</h3>
            <p className="text-gray-600 text-sm">Modifiez votre mot de passe pour sécuriser votre compte</p>
          </div>
          {!isChangingPassword && (
            <Button variant="secondary" onClick={() => setIsChangingPassword(true)}>
              Changer le mot de passe
            </Button>
          )}
        </div>

        {isChangingPassword && (
          <div className="space-y-4">
            <Input
              label="Mot de passe actuel"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
            />
            <Input
              label="Nouveau mot de passe"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
              minLength={8}
            />
            <Input
              label="Confirmer le nouveau mot de passe"
              name="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
            <div className="flex space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsChangingPassword(false)
                  setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
                  setPasswordError(null)
                }}
              >
                Annuler
              </Button>
              <Button variant="primary" onClick={handlePasswordSubmit}>
                Mettre à jour
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Méthode de connexion</h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            {user.googleId ? (
              <>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Connexion Google</p>
                  <p className="text-sm text-gray-600">Connecté via votre compte Google</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email et mot de passe</p>
                  <p className="text-sm text-gray-600">Connexion traditionnelle</p>
                </div>
              </>
            )}
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Actif
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions du compte</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Exporter mes données</p>
              <p className="text-sm text-gray-600">Télécharger une copie de toutes vos données</p>
            </div>
            <Button variant="secondary" size="sm">
              Exporter
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <p className="font-medium text-red-900">Supprimer le compte</p>
              <p className="text-sm text-red-700">Cette action est irréversible</p>
            </div>
            <Button variant="danger" size="sm">
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecuritySettings
