"use client"

import { useState, useEffect, useMemo } from "react"
import { useNavigate, Link } from "react-router-dom"
import { getContracts } from "../services/contractService"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

import Button from "../components/Button"
import Input from "../components/Input"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"

function ContractsPage() {
  const [contracts, setContracts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setIsLoading(true)
        const response = await getContracts()
        const contractsData = response.data || response
        setContracts(Array.isArray(contractsData) ? contractsData : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContracts()
  }, [])

  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      // Filtre par recherche texte
      const matchesSearch = 
        searchTerm === "" ||
        (contract.title && contract.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contract.fileName && contract.fileName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contract.content && contract.content.toLowerCase().includes(searchTerm.toLowerCase()))

      // Filtre par statut
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "pending" && contract.status === "pending") ||
        (statusFilter === "analyzed" && contract.status === "analyzed")

      // Filtre par niveau de risque
      let contractRiskLevel = "low"
      if (contract.analyses && contract.analyses.length > 0) {
        contractRiskLevel = contract.analyses[0].riskLevel || "low"
      } else if (contract.riskLevel) {
        contractRiskLevel = contract.riskLevel
      }

      const matchesRisk = 
        riskFilter === "all" ||
        (riskFilter === "high" && contractRiskLevel === "high") ||
        (riskFilter === "medium" && contractRiskLevel === "medium") ||
        (riskFilter === "low" && contractRiskLevel === "low")

      return matchesSearch && matchesStatus && matchesRisk
    })
  }, [contracts, searchTerm, statusFilter, riskFilter])

  const generateSmartTitle = (contract) => {
    if (contract.title && contract.title.trim() !== '') {
      return contract.title
    }

    if (contract.fileName) {
      const cleanFileName = contract.fileName
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase())
      
      if (cleanFileName.trim() !== '') {
        return cleanFileName
      }
    }

    if (contract.contractType) {
      return `Contrat ${contract.contractType}`
    }

    if (contract.uploadDate || contract.createdAt) {
      const date = new Date(contract.uploadDate || contract.createdAt)
      return `Contrat du ${date.toLocaleDateString('fr-FR')}`
    }

    return `Contrat #${contract._id?.slice(-6) || contract.id?.slice(-6) || 'XXX'}`
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-700">Erreur lors du chargement des contrats: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Mes Contrats</h1>
          <p className="text-gray-500 mt-1">Tous vos contrats en un seul endroit</p>
        </div>
        <Button variant="primary" onClick={() => navigate("/upload")}>
          Nouveau Contrat
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold">
              Liste des Contrats ({filteredContracts.length}/{contracts.length})
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <Input
                type="text"
                placeholder="Rechercher un contrat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex space-x-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="analyzed">Analysé</option>
                </select>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous les risques</option>
                  <option value="high">Risque élevé</option>
                  <option value="medium">Risque moyen</option>
                  <option value="low">Risque faible</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {filteredContracts.length === 0 ? (
          <EmptyState 
            title="Aucun contrat trouvé"
            description={contracts.length === 0 
              ? "Commencez par uploader votre premier contrat." 
              : "Aucun contrat ne correspond à vos critères de recherche."}
            actionText="Uploader un Contrat"
            actionLink="/upload"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contrat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Niveau de Risque
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière Analyse
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContracts.map((contract) => {
                  let contractRiskLevel = "low"
                  if (contract.analyses && contract.analyses.length > 0) {
                    contractRiskLevel = contract.analyses[0].riskLevel || "low"
                  } else if (contract.riskLevel) {
                    contractRiskLevel = contract.riskLevel
                  }

                  return (
                    <tr key={contract._id || contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {generateSmartTitle(contract)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {contract.fileName || 'Aucun nom de fichier'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(contract.uploadDate || contract.createdAt), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          contract.status === 'analyzed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {contract.status === 'analyzed' ? 'Analysé' : 'En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            contractRiskLevel === "high"
                              ? "bg-red-100 text-red-800"
                              : contractRiskLevel === "medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {contractRiskLevel === "high" 
                            ? "Élevé" 
                            : contractRiskLevel === "medium" 
                              ? "Moyen" 
                              : "Faible"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {contract.lastAnalyzed 
                            ? formatDistanceToNow(new Date(contract.lastAnalyzed), {
                                addSuffix: true,
                                locale: fr
                              })
                            : 'Non analysé'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link 
                            to={`/contracts/${contract._id || contract.id}`} 
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Voir
                          </Link>
                          <button className="text-gray-600 hover:text-gray-900">
                            Télécharger
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContractsPage