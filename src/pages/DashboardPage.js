import { Link } from "react-router-dom"
import { useEffect } from "react"
import { useContract } from "../helpers/useContract"
import Button from "../components/Button"

function DashboardPage() {
  const { getAllContracts, contracts, isLoading, error } = useContract()

  useEffect(() => {
    getAllContracts()
  }, [getAllContracts])

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
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-gray-900 rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-700">Error loading contracts: {error}</div>
        <button 
          onClick={() => getAllContracts()} 
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage and analyze your contracts</p>
        </div>
        <Button variant="primary">
          <Link to="/upload">Upload New Contract</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Contracts</h3>
            <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl md:text-3xl font-semibold">{contracts.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">High Risk Contracts</h3>
            <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl md:text-3xl font-semibold">
              {contracts.filter((c) => c.analyses?.[0]?.riskLevel === "high" || c.riskLevel === "high").length}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Low Risk Contracts</h3>
            <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center">
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl md:text-3xl font-semibold">
              {contracts.filter((c) => c.analyses?.[0]?.riskLevel === "low" || c.riskLevel === "low").length}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">AI Credits</h3>
            <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl md:text-3xl font-semibold">Unlimited</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Recent Contracts</h2>
        </div>

        {contracts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50">
            <svg className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium">No contracts found</h3>
            <p className="text-gray-500 mt-1">Upload your first contract to get started.</p>
            <div className="mt-6">
              <Button variant="primary">
                <Link to="/upload">Upload Contract</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contract
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Risk Level
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts.slice(0, 5).map((contract) => (
                  <tr key={contract._id || contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {generateSmartTitle(contract)}
                      </div>
                      <div className="text-sm text-gray-500">{contract.fileName || 'No filename'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(contract.uploadDate || contract.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {contract.status || 'processed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          (contract.analyses?.[0]?.riskLevel || contract.riskLevel) === "high"
                            ? "bg-red-100 text-red-800"
                            : (contract.analyses?.[0]?.riskLevel || contract.riskLevel) === "medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {contract.analyses?.[0]?.riskLevel || contract.riskLevel || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/contracts/${contract._id || contract.id}`} className="text-gray-900 hover:text-gray-700">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage