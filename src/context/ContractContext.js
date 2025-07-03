"use client"

import { createContext, useState, useCallback } from "react"

export const ContractContext = createContext({
  contracts: [],
  currentContract: null,
  analyses: {},
  isLoading: false,
  error: null,
  uploadContract: async () => { },
  analyzeContract: async () => { },
  getContract: () => { },
  getAnalysis: () => { },
  setCurrentContract: () => { },
  getAllContracts: async() => { }
})

export function ContractProvider({ children }) {
  const [contracts, setContracts] = useState([])
  const [currentContract, setCurrentContract] = useState(null)
  const [analyses, setAnalyses] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const getAllContracts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/contract/allContracts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response:', data)

      // Extract the contracts array from the response
      const contractsArray = data.data || data || []
      setContracts(contractsArray)
      
      setIsLoading(false)
      return contractsArray

    } catch (error) {
      console.error("Get all contracts failed:", error)
      setError(error.message)
      setContracts([])
      setIsLoading(false)
      throw error
    }
  }, [])

  // Upload a new contract
  const uploadContract = useCallback(async (contractData) => {
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/contract/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contractData),
      })

      if (!response.ok) {
        throw new Error("Failed to upload contract")
      }

      const result = await response.json()
      const newContract = result.data?.contractAnalyzedByIA || result.data

      setContracts((prevContracts) => [...prevContracts, newContract])
      setCurrentContract(newContract)
      setIsLoading(false)

      return newContract
    } catch (err) {
      const errorMessage = err.message || "Failed to upload contract"
      setError(errorMessage)
      setIsLoading(false)
      throw err
    }
  }, [])

  // Analyze a contract
  const analyzeContract = useCallback(async (contractContent) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/contract/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: contractContent })
      })

      if (!response.ok) {
        throw new Error("Failed to analyze contract")
      }

      const result = await response.json()
      setIsLoading(false)
      
      return result
    } catch (err) {
      const errorMessage = err.message || "Failed to analyze contract"
      setError(errorMessage)
      setIsLoading(false)
      throw err
    }
  }, [])

  // Get a contract by ID
  const getContract = useCallback(
    (id) => {
      return contracts.find((contract) => contract._id === id || contract.id === id) || null
    },
    [contracts],
  )

  // Get an analysis by ID
  const getAnalysis = useCallback(
    (id) => {
      return analyses[id] || null
    },
    [analyses],
  )

  return (
    <ContractContext.Provider
      value={{
        contracts,
        currentContract,
        analyses,
        isLoading,
        error,
        uploadContract,
        analyzeContract,
        getContract,
        getAllContracts,
        getAnalysis,
        setCurrentContract,
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}