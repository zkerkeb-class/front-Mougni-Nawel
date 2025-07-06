/**
 * Utility functions for text processing in the contract analysis application - FIXED VERSION
 */

/**
 * Detects sensitive data in contract text
 * @param {string} text - The contract text to analyze
 * @returns {Array} - Array of sensitive data items with type, index, length, and value
 */
export function detectSensitiveData(text) {
  if (!text) return [];
  
  const sensitiveItems = [];
  
  // Regular expressions for different types of sensitive data - IMPROVED
  const patterns = {
    // Emails - plus précis
    "Email": /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    
    // Phone numbers - format français amélioré
    "Phone Number": /(?:\+33|0)[1-9](?:[.\s-]?\d{2}){4}|\b\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}\b/g,
    
    // French Social Security Numbers (INSEE) - plus strict
    "Social Security Number": /\b[12]\d{12}\d{2}\b/g,
    
    // Credit card numbers - plus strict
    "Credit Card": /\b(?:\d{4}[.\s-]?){3}\d{4}\b/g,
    
    // IBAN français - format exact
    "Bank Account": /\bFR\d{2}\s?(?:\d{4}\s?){5}\d{2}\b/g,
    
    // Adresses françaises - plus précis
    "Address": /\b\d{1,4}(?:\s+(?:bis|ter|quater|[A-C]))?\s+(?:rue|avenue|boulevard|place|impasse|allée|chemin|square|passage|villa|cours|quai|pont|route|voie)\s+[A-Za-zÀ-ÿ\s'-]+(?:,\s*\d{5}(?:\s+[A-Za-zÀ-ÿ\s-]+)?)?/gi,
    
    // Noms avec titre - plus strict
    "Name with Title": /\b(?:M\.|Mr\.|Mme|Mlle|Mrs\.|Ms\.|Dr\.|Prof\.|Maître)\s+[A-ZÀ-Ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ]+)?/g,
    
    // SIRET/SIREN - format exact
    "Company Registration": /\b(?:SIRET|SIREN)[\s:]*(\d{9}|\d{14})\b/gi,
    
    // Code postal français seul
    "Postal Code": /\b\d{5}\b/g,
    
    // Dates de naissance - plus précis
    "Date of Birth": /\b(?:né[e]?\s+le|date\s+de\s+naissance|ddn|born\s+on)[\s:]+\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}\b/gi,
    
    // Salaires - plus précis
    "Salary": /\b(?:salaire|rémunération|traitement)[\s:]*\d{1,3}(?:\s?\d{3})*(?:[.,]\d{2})?\s*(?:euros?|€|EUR)\b/gi,
    
    // Numéros de passeport/CNI français
    "National ID": /\b(?:passeport|CNI|carte\s+d'identité)[\s:]*[A-Z0-9]{8,12}\b/gi,
    
    // Plaques d'immatriculation françaises
    "License Plate": /\b[A-Z]{2}-\d{3}-[A-Z]{2}\b/g,
  };
  
  // Find matches for each pattern
  Object.entries(patterns).forEach(([type, pattern]) => {
    // Reset regex lastIndex to avoid issues with global flags
    pattern.lastIndex = 0;
    
    let match;
    while ((match = pattern.exec(text)) !== null) {
      // Éviter les boucles infinies
      if (match[0].length === 0) {
        pattern.lastIndex++;
        continue;
      }
      
      sensitiveItems.push({
        type,
        index: match.index,
        length: match[0].length,
        value: match[0].trim(),
        context: getContext(text, match.index, match[0].length)
      });
    }
  });
  
  // Remove duplicates and overlapping matches
  const uniqueItems = removeDuplicateMatches(sensitiveItems);
  
  // Sort by position in the text
  return uniqueItems.sort((a, b) => a.index - b.index);
}

/**
 * Get context around a match for better understanding
 * @param {string} text - Full text
 * @param {number} index - Match index
 * @param {number} length - Match length
 * @returns {string} - Context string
 */
function getContext(text, index, length) {
  const start = Math.max(0, index - 30);
  const end = Math.min(text.length, index + length + 30);
  return text.substring(start, end).replace(/\s+/g, ' ').trim();
}

/**
 * Remove duplicate and overlapping matches
 * @param {Array} items - Array of sensitive data items
 * @returns {Array} - Filtered array without duplicates
 */
function removeDuplicateMatches(items) {
  if (!items || items.length === 0) return [];
  
  // Sort by index first
  const sorted = [...items].sort((a, b) => a.index - b.index);
  const unique = [];
  
  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    let isOverlapping = false;
    
    // Check if current item overlaps with any item in unique array
    for (let j = 0; j < unique.length; j++) {
      const existing = unique[j];
      
      // Check for overlap
      if (current.index < existing.index + existing.length && 
          current.index + current.length > existing.index) {
        
        // If overlapping, keep the longer match or the more specific type
        if (current.length > existing.length || 
            getPriorityScore(current.type) > getPriorityScore(existing.type)) {
          unique.splice(j, 1); // Remove existing
          break;
        } else {
          isOverlapping = true;
          break;
        }
      }
    }
    
    if (!isOverlapping) {
      unique.push(current);
    }
  }
  
  return unique;
}

/**
 * Get priority score for different types of sensitive data
 * @param {string} type - Type of sensitive data
 * @returns {number} - Priority score (higher = more important)
 */
function getPriorityScore(type) {
  const priorities = {
    'Social Security Number': 10,
    'Credit Card': 9,
    'Bank Account': 8,
    'National ID': 7,
    'Email': 6,
    'Phone Number': 5,
    'Name with Title': 4,
    'Address': 3,
    'Company Registration': 2,
    'Salary': 2,
    'Date of Birth': 1,
    'License Plate': 1,
    'Postal Code': 0
  };
  
  return priorities[type] || 0;
}

/**
 * Anonymize sensitive data in text
 * @param {string} text - Original text
 * @param {Array} sensitiveItems - Array of sensitive data items from detectSensitiveData
 * @param {string} placeholder - Placeholder text (default: '[REDACTED]')
 * @returns {string} - Anonymized text
 */
export function anonymizeText(text, sensitiveItems, placeholder = '[REDACTED]') {
  if (!text || !sensitiveItems || sensitiveItems.length === 0) return text;
  
  // Sort by index in descending order to avoid index shifting issues
  const sortedItems = [...sensitiveItems].sort((a, b) => b.index - a.index);
  
  let anonymizedText = text;
  
  sortedItems.forEach(item => {
    const before = anonymizedText.substring(0, item.index);
    const after = anonymizedText.substring(item.index + item.length);
    anonymizedText = before + placeholder + after;
  });
  
  return anonymizedText;
}

/**
 * Generate a summary report of sensitive data found
 * @param {Array} sensitiveItems - Array of sensitive data items
 * @returns {Object} - Summary report
 */
export function generateSensitiveDataReport(sensitiveItems) {
  if (!sensitiveItems || sensitiveItems.length === 0) {
    return {
      total: 0,
      byType: {},
      riskLevel: 'LOW',
      recommendations: ['No sensitive data detected in the contract.']
    };
  }
  
  const byType = {};
  sensitiveItems.forEach(item => {
    byType[item.type] = (byType[item.type] || 0) + 1;
  });
  
  const riskLevel = calculateRiskLevel(sensitiveItems);
  const recommendations = generateRecommendations(byType, riskLevel);
  
  return {
    total: sensitiveItems.length,
    byType,
    riskLevel,
    recommendations,
    items: sensitiveItems
  };
}

/**
 * Calculate risk level based on sensitive data types found
 * @param {Array} sensitiveItems - Array of sensitive data items
 * @returns {string} - Risk level: LOW, MEDIUM, HIGH, CRITICAL
 */
function calculateRiskLevel(sensitiveItems) {
  const highRiskTypes = ['Social Security Number', 'Credit Card', 'Bank Account'];
  const mediumRiskTypes = ['National ID', 'Email', 'Phone Number', 'Salary'];
  
  const hasHighRisk = sensitiveItems.some(item => highRiskTypes.includes(item.type));
  const hasMediumRisk = sensitiveItems.some(item => mediumRiskTypes.includes(item.type));
  
  if (hasHighRisk) return 'CRITICAL';
  if (hasMediumRisk) return 'HIGH';
  if (sensitiveItems.length > 5) return 'MEDIUM';
  return 'LOW';
}

/**
 * Generate recommendations based on detected sensitive data
 * @param {Object} byType - Count of sensitive data by type
 * @param {string} riskLevel - Risk level
 * @returns {Array} - Array of recommendation strings
 */
function generateRecommendations(byType, riskLevel) {
  const recommendations = [];
  
  if (riskLevel === 'CRITICAL') {
    recommendations.push('⚠️ CRITICAL: This contract contains highly sensitive financial or identity information.');
    recommendations.push('• Implement strict access controls and encryption');
    recommendations.push('• Consider anonymizing the contract for general distribution');
    recommendations.push('• Ensure compliance with GDPR and data protection regulations');
  }
  
  if (byType['Social Security Number']) {
    recommendations.push('• Social Security Numbers detected - ensure GDPR compliance');
  }
  
  if (byType['Credit Card'] || byType['Bank Account']) {
    recommendations.push('• Financial information detected - implement PCI DSS compliance measures');
  }
  
  if (byType['Email'] || byType['Phone Number']) {
    recommendations.push('• Contact information detected - verify consent for data processing');
  }
  
  if (byType['Address']) {
    recommendations.push('• Address information detected - consider if location data is necessary');
  }
  
  if (Object.keys(byType).length > 0) {
    recommendations.push('• Review data retention policies');
    recommendations.push('• Consider implementing data minimization principles');
  }
  
  return recommendations;
}

/**
 * Validate French-specific data formats
 * @param {string} value - Value to validate
 * @param {string} type - Type of data to validate
 * @returns {boolean} - Whether the value is valid
 */
export function validateFrenchFormat(value, type) {
  const validators = {
    'Social Security Number': (val) => {
      // French INSEE number validation
      const cleaned = val.replace(/\s/g, '');
      if (cleaned.length !== 15) return false;
      
      const key = cleaned.substring(13, 15);
      const number = cleaned.substring(0, 13);
      const calculatedKey = 97 - (parseInt(number) % 97);
      
      return parseInt(key) === calculatedKey;
    },
    
    'IBAN': (val) => {
      // French IBAN validation
      const cleaned = val.replace(/\s/g, '');
      if (!cleaned.startsWith('FR') || cleaned.length !== 27) return false;
      
      // Basic IBAN checksum validation
      const rearranged = cleaned.substring(4) + cleaned.substring(0, 4);
      const numericString = rearranged.replace(/[A-Z]/g, (char) => 
        (char.charCodeAt(0) - 65 + 10).toString()
      );
      
      return mod97(numericString) === 1;
    },
    
    'SIRET': (val) => {
      const cleaned = val.replace(/\s/g, '');
      return cleaned.length === 14 && /^\d{14}$/.test(cleaned);
    },
    
    'SIREN': (val) => {
      const cleaned = val.replace(/\s/g, '');
      return cleaned.length === 9 && /^\d{9}$/.test(cleaned);
    }
  };
  
  return validators[type] ? validators[type](value) : true;
}

/**
 * Helper function for IBAN validation
 * @param {string} str - Numeric string
 * @returns {number} - Modulo 97 result
 */
function mod97(str) {
  let remainder = 0;
  for (let i = 0; i < str.length; i++) {
    remainder = (remainder * 10 + parseInt(str[i])) % 97;
  }
  return remainder;
}

/**
 * Extract and structure contract metadata
 * @param {string} text - Contract text
 * @returns {Object} - Structured contract metadata
 */
export function extractContractMetadata(text) {
  const metadata = {
    parties: [],
    dates: [],
    amounts: [],
    terms: [],
    locations: []
  };
  
  // Extract contract parties
  const partyPatterns = [
    /entre\s+([A-ZÀ-Ÿ][a-zà-ÿ\s]+),?\s+(?:ci-après|désigné)/gi,
    /(?:la\s+société|l'entreprise|le\s+client)\s+([A-ZÀ-Ÿ][a-zà-ÿ\s]+)/gi
  ];
  
  partyPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      metadata.parties.push(match[1].trim());
    }
  });
  
  // Extract important dates
  const datePattern = /\b\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}\b/g;
  let dateMatch;
  while ((dateMatch = datePattern.exec(text)) !== null) {
    metadata.dates.push(dateMatch[0]);
  }
  
  // Extract monetary amounts
  const amountPattern = /\b\d{1,3}(?:\s?\d{3})*(?:[.,]\d{2})?\s*(?:euros?|€|EUR)\b/gi;
  let amountMatch;
  while ((amountMatch = amountPattern.exec(text)) !== null) {
    metadata.amounts.push(amountMatch[0]);
  }
  
  return metadata;
}