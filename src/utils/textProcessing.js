/**
 * Utility functions for text processing in the contract analysis application
 */

/**
 * Detects sensitive data in contract text
 * @param {string} text - The contract text to analyze
 * @returns {Array} - Array of sensitive data items with type, index, length, and value
 */
export function detectSensitiveData(text) {
  if (!text) return [];
  
  const sensitiveItems = [];
  
  // Regular expressions for different types of sensitive data
  const patterns = {
    "Email": /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    "Phone Number": /\b(?:\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/g,
    "Social Security Number": /\b\d{1,3}[ -]?\d{2}[ -]?\d{2}[ -]?\d{3}[ -]?\d{3}\b/g,
    "Address": /\b\d+\s+[A-Za-z]+\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Court|Ct|Lane|Ln|Way|Terrace|Ter|Place|Pl|Square|Sq)[.,]?\s+(?:[A-Za-z]+[.,]?\s+)*(?:\d{5}(?:-\d{4})?)?/gi,
    "Credit Card": /\b(?:\d{4}[- ]?){3}\d{4}\b/g,
    "Date of Birth": /\b(?:Born on|Date of Birth|DOB|Né[e]? le)[\s:]+\d{1,2}[-\/. ]\d{1,2}[-\/. ]\d{2,4}\b/gi,
    "Bank Account": /\b[A-Z]{2}\d{2}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}\b/g,
    "National ID": /\b\d{1}[ ]?\d{2}[ ]?\d{2}[ ]?\d{2}[ ]?\d{3}[ ]?\d{3}[ ]?\d{2}\b/g,
    "Name with Title": /\b(?:M\.|Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)(?:[ ]?[A-Z][a-zÀ-ö]+){1,2}\b/g,
  };
  
  // Find matches for each pattern
  Object.entries(patterns).forEach(([type, pattern]) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      sensitiveItems.push({
        type,
        index: match.index,
        length: match[0].length,
        value: match[0]
      });
    }
  });
  
  // Sort by position in the text
  return sensitiveItems.sort((a, b) => a.index - b.index);
}

/**
 * Masks sensitive data in contract text
 * @param {string} text - The contract text
 * @param {Array} sensitiveItems - Array of sensitive data items
 * @returns {string} - Text with sensitive data masked
 */
export function maskSensitiveData(text, sensitiveItems) {
  if (!text || !sensitiveItems || sensitiveItems.length === 0) return text;
  
  // Sort items by index in descending order to avoid offset issues when replacing
  const sortedItems = [...sensitiveItems].sort((a, b) => b.index - a.index);
  
  let maskedText = text;
  
  sortedItems.forEach((item) => {
    const mask = "X".repeat(item.length);
    maskedText = maskedText.substring(0, item.index) + mask + maskedText.substring(item.index + item.length);
  });
  
  return maskedText;
}

/**
 * Extracts key information from contract text
 * @param {string} text - The contract text
 * @returns {Object} - Object with extracted key information
 */
export function extractContractInfo(text) {
  if (!text) return {};
  
  const info = {};
  
  // Extract contract type
  const contractTypeMatch = text.match(/\b(?:CONTRAT|CONTRACT)\s+DE\s+([^\n]+)/i);
  if (contractTypeMatch) {
    info.contractType = contractTypeMatch[1].trim();
  }
  
  // Extract parties
  const partiesSection = text.match(/Entre les soussignés\s?:([^]*?)(?:Article|$)/i);
  if (partiesSection) {
    const partiesText = partiesSection[1];
    
    // Extract company
    const companyMatch = partiesText.match(/Société\s?:\s?([^\n]+)/i);
    if (companyMatch) {
      info.company = companyMatch[1].trim();
    }
    
    // Extract employee
    const employeeMatch = partiesText.match(/Salarié\(e\)\s?:\s?([^\n]+)/i);
    if (employeeMatch) {
      info.employee = employeeMatch[1].trim();
    }
  }
  
  // Extract start date
  const startDateMatch = text.match(/(?:à compter du|start date|beginning on|commencing on)\s+(\d{1,2}[\s./-]\w+[\s./-]\d{2,4}|\w+\s+\d{1,2},?\s+\d{2,4})/i);
  if (startDateMatch) {
    info.startDate = startDateMatch[1].trim();
  }
  
  // Extract salary
  const salaryMatch = text.match(/(?:rémunération|salary|compensation).{1,50}(\d[\d\s.,]*\d)(?:\s+\w+)?(?:\s+\w+)?/i);
  if (salaryMatch) {
    info.salary = salaryMatch[1].trim();
  }
  
  return info;
}

/**
 * Analyzes contract for risk areas
 * @param {string} text - The contract text
 * @returns {Array} - Array of potential risk areas with type, description, and severity
 */
export function analyzeContractRisks(text) {
  if (!text) return [];
  
  const risks = [];
  
  // Check for non-compete clause
  if (/non[\s-]concurrence|non[\s-]compete/i.test(text)) {
    risks.push({
      type: "Non-Compete Clause",
      description: "Contract contains a non-compete clause that may restrict future employment",
      severity: "Medium"
    });
  }
  
  // Check for probation period
  if (/période d['']essai|probation period|trial period/i.test(text)) {
    risks.push({
      type: "Probation Period",
      description: "Contract includes a probation period that may allow termination without notice",
      severity: "Low"
    });
  }
  
  // Check for termination conditions
  if (/termination|dismissal|licenciement|résiliation|rupture/i.test(text)) {
    risks.push({
      type: "Termination Conditions",
      description: "Contract specifies conditions for termination that should be reviewed",
      severity: "Medium"
    });
  }
  
  // Check for intellectual property clauses
  if (/intellectual property|propriété intellectuelle|copyright|copyright|patent|brevet/i.test(text)) {
    risks.push({
      type: "Intellectual Property",
      description: "Contract contains intellectual property clauses that may affect ownership of your work",
      severity: "High"
    });
  }
  
  return risks;
}