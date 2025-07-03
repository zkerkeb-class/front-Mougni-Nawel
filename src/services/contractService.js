/**
 * Service for contract-related API calls
 */

// Base API URL
const API_URL = process.env.REACT_APP_API_URL;
const AI_API_URL = process.env.REACT_APP_API_AI_URL;

/**
 * Get all contracts for the current user
 * @returns {Promise<Array>} Array of contracts
 */
export async function getContracts() {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/contracts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch contracts")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching contracts:", error)
    throw error
  }
}

/**
 * Get a specific contract by ID
 * @param {string} id Contract ID
 * @returns {Promise<Object>} Contract data
 */
export async function getContract(id) {
  try {
    // const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/contract/${id}/info`, {
      method: "GET",
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch contract")
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching contract ${id}:`, error)
    throw error
  }
}

/**
 * Upload a new contract
 * @param {Object} contractData Contract data to upload
 * @returns {Promise<Object>} Uploaded contract data
 */
export async function uploadContract(contractData) {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/contracts`, {
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

    return await response.json()
  } catch (error) {
    console.error("Error uploading contract:", error)
    throw error
  }
}

/**
 * Analyze a contract
 * @param {string} id Contract ID
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeContract(contractData) {
  try {
    const token = localStorage.getItem("token")
    console.log('pop : ', token)
    contractData = contractData.replace(/^"+|"+$/g, '');
    const response = await fetch(`${API_URL}/contract/save`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text: contractData })
    })

    if (!response.ok) {
      throw new Error("Failed to analyze contract")
    }

    return await response.json()
  } catch (error) {
    console.error(`Error analyzing contract :`, error)
    throw error
  }
}

/**
 * Update a contract
 * @param {string} id Contract ID
 * @param {Object} updates Updates to apply
 * @returns {Promise<Object>} Updated contract data
 */
export async function updateContract(id, updates) {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/contracts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error("Failed to update contract")
    }

    return await response.json()
  } catch (error) {
    console.error(`Error updating contract ${id}:`, error)
    throw error
  }
}

/**
 * Delete a contract
 * @param {string} id Contract ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteContract(id) {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/contracts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete contract")
    }

    return true
  } catch (error) {
    console.error(`Error deleting contract ${id}:`, error)
    throw error
  }
}
