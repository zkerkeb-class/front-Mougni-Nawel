/**
 * Service for contract-related API calls
 */

// Base API URLs - Correspondant aux microservices
const BDD_API_URL = process.env.REACT_APP_API_URL;
const IA_API_URL = process.env.REACT_APP_API_AI_URL;

/**
 * Get all contracts for the current user
 * @returns {Promise<Array>} Array of contracts
 */
export async function getContracts() {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("No authentication token found")
    }

    // Utiliser le bon endpoint du microservice BDD
    const response = await fetch(`${BDD_API_URL}/contract/allContracts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to fetch contracts")
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
    if (!id) {
      throw new Error("Contract ID is required")
    }

    // Utiliser le bon endpoint du microservice BDD
    const response = await fetch(`${BDD_API_URL}/contract/${id}/info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to fetch contract")
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching contract ${id}:`, error)
    throw error
  }
}

/**
 * Save a new contract (this will automatically trigger analysis)
 * @param {Object} contractData Contract data with text and title
 * @returns {Promise<Object>} Saved contract data
 */
export async function saveContract(contractData) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    if (!contractData.text || !contractData.text.trim()) {
      throw new Error("Contract text is required");
    }

    const cleanText = contractData.text.replace(/^"+|"+$/g, "").trim();

    const payload = {
      text: cleanText,
      title: contractData.title || `Contract ${new Date().toLocaleDateString()}`,
    };

    console.log("Saving contract with payload:", payload);

    const response = await fetch(`${BDD_API_URL}/contract/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to save contract");
    }

    const data = await response.json();
    
    // ✅ Gérer les doublons côté frontend
    if (data.data && data.data.isDuplicate) {
      console.log("Contrat dupliqué détecté:", data.data._id);
      
      // Vous pouvez choisir de :
      // 1. Rediriger vers le contrat existant
      // 2. Afficher un message à l'utilisateur
      // 3. Demander confirmation pour continuer
      
      return {
        success: true,
        data: data.data,
        isDuplicate: true,
        message: "Ce contrat existe déjà. Redirection vers le contrat existant."
      };
    }

    console.log("Contract saved successfully:", data);
    return {
      success: true,
      data: data.data,
      isDuplicate: false,
      message: "Contrat créé avec succès"
    };

  } catch (error) {
    console.error("Error saving contract:", error);
    throw error;
  }
}

// ✅ Fonction pour vérifier les doublons avant sauvegarde
export async function checkForDuplicates(contractText) {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BDD_API_URL}/contract/check-duplicate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: contractText }),
    });

    if (!response.ok) {
      return { hasDuplicate: false };
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error checking for duplicates:", error);
    return { hasDuplicate: false };
  }
}

/**
 * Manually trigger analysis for a contract (if needed)
 * @param {string} contractId Contract ID
 * @returns {Promise<Object>} Analysis results
 */
export async function triggerAnalysis(contractId) {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("No authentication token found")
    }

    if (!contractId) {
      throw new Error("Contract ID is required")
    }

    console.log("Triggering manual analysis for contract:", contractId)

    const response = await fetch(`${BDD_API_URL}/contract/${contractId}/trigger-analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to trigger analysis")
    }

    const data = await response.json()
    console.log("Analysis triggered successfully:", data)
    return data
  } catch (error) {
    console.error(`Error triggering analysis for contract ${contractId}:`, error)
    throw error
  }
}

/**
 * Poll for analysis completion
 * @param {string} contractId Contract ID
 * @param {number} maxAttempts Maximum polling attempts
 * @param {number} interval Polling interval in ms
 * @returns {Promise<Object>} Final contract data with analysis
 */
export async function pollForAnalysis(contractId, maxAttempts = 30, interval = 2000) {
  let attempts = 0

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        attempts++
        console.log(`Polling attempt ${attempts}/${maxAttempts} for contract ${contractId}`)

        const contractData = await getContract(contractId)

        if (contractData.success && contractData.data) {
          const { status, analyses } = contractData.data

          // Si l'analyse est terminée ou si on a des analyses
          if (status === "analyzed" || (analyses && analyses.length > 0)) {
            console.log("Analysis completed:", contractData.data)
            resolve(contractData)
            return
          }
        }

        // Si on a atteint le maximum de tentatives
        if (attempts >= maxAttempts) {
          console.log("Max polling attempts reached")
          resolve(contractData) // Retourner les données actuelles même si pas terminé
          return
        }

        // Continuer le polling
        setTimeout(poll, interval)
      } catch (error) {
        console.error("Error during polling:", error)
        if (attempts >= maxAttempts) {
          reject(error)
        } else {
          setTimeout(poll, interval)
        }
      }
    }

    poll()
  })
}

// ⚠️ FONCTIONS LEGACY - REMPLACÉES PAR saveContract()

/**
 * @deprecated Use saveContract instead
 * Cette fonction est conservée pour compatibilité mais utilise saveContract en interne
 */
export async function uploadContract(contractData) {
  console.warn("uploadContract is deprecated, use saveContract instead")
  return saveContract(contractData)
}

/**
 * @deprecated Use saveContract instead - analysis is triggered automatically
 * Cette fonction causait la double analyse, maintenant elle utilise saveContract
 */
export async function analyzeContract(contractText) {
  console.warn("analyzeContract is deprecated and was causing double analysis. Use saveContract instead")

  // Si c'est juste du texte, le convertir en objet
  const contractData = typeof contractText === "string" ? { text: contractText } : contractText

  return saveContract(contractData)
}

/**
 * @deprecated Not implemented in backend
 */
export async function updateContract(id, updates) {
  throw new Error("updateContract is not implemented in the current backend architecture")
}

/**
 * @deprecated Not implemented in backend
 */
export async function deleteContract(id) {
  throw new Error("deleteContract is not implemented in the current backend architecture")
}