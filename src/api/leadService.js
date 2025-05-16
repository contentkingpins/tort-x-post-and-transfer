import axios from 'axios';

/**
 * Service for handling tort lead submissions to the Ringba API
 */
const API_URL = 'https://display.ringba.com/enrich/263344012027051643';

/**
 * Submits a tort lead to the API
 * @param {Object} leadData - The lead data to submit
 * @returns {Promise} - The API response
 */
export const submitTortLead = async (leadData) => {
  try {
    const response = await axios.post(API_URL, null, {
      params: {
        isTest: leadData.isTest ? '1' : '0',
        callerId: leadData.callerId,
        claimantName: leadData.claimantName,
        claimantEmail: leadData.claimantEmail,
        sourceId: leadData.sourceId,
        incidentState: leadData.incidentState,
        incidentDate: formatDate(leadData.incidentDate),
        atFault: leadData.atFault ? 'Yes' : 'No',
        attorney: leadData.attorney ? 'Yes' : 'No',
        settlement: leadData.settlement ? 'Yes' : 'No',
        trustedFormCertURL: leadData.trustedFormCertURL || '',
        pubId: leadData.pubId || ''
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error submitting lead:', error);
    throw error;
  }
};

/**
 * Formats a date to MM/DD/YYYY format
 * @param {Date} date - The date to format
 * @returns {string} - The formatted date string
 */
const formatDate = (date) => {
  if (!date) return '';
  
  if (typeof date === 'string') {
    // If it's already a string, ensure it's in the right format
    const parts = date.split(/[-/]/);
    if (parts.length === 3) {
      // Check if the date is in YYYY-MM-DD format
      if (parts[0].length === 4) {
        return `${parts[1]}/${parts[2]}/${parts[0]}`;
      } else {
        return date; // Already in MM/DD/YYYY format
      }
    }
  }
  
  // If it's a Date object
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

export default {
  submitTortLead
}; 