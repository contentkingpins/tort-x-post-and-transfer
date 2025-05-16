import axios from 'axios';

/**
 * Service for handling tort lead submissions to the Ringba API
 */
const API_URL = 'https://display.ringba.com/enrich/263344012027051643';

/**
 * Saves a lead to localStorage for tracking
 * @param {Object} leadData - The lead data to save
 * @param {string} status - The submission status
 */
const saveLeadToHistory = (leadData, status) => {
  // Get existing leads from localStorage or initialize empty array
  const existingLeads = JSON.parse(localStorage.getItem('submittedLeads') || '[]');
  
  // Add submission timestamp and status
  const leadWithMeta = {
    ...leadData,
    submittedAt: new Date().toISOString(),
    status,
    apiResponse: status === 'success' ? { status: 'ok' } : { status: 'error' }
  };
  
  // Add to existing leads
  existingLeads.push(leadWithMeta);
  
  // Save back to localStorage
  localStorage.setItem('submittedLeads', JSON.stringify(existingLeads));
  
  return leadWithMeta;
};

/**
 * Gets all submitted leads from localStorage
 * @returns {Array} - Array of submitted leads
 */
export const getSubmittedLeads = () => {
  return JSON.parse(localStorage.getItem('submittedLeads') || '[]');
};

/**
 * Exports leads to CSV format
 * @param {Array} leads - Array of leads to export
 * @returns {string} - CSV string
 */
export const exportLeadsToCSV = (leads) => {
  if (!leads || leads.length === 0) {
    return '';
  }
  
  // Define CSV columns
  const columns = [
    'sourceId',
    'submittedAt',
    'status',
    'callerId',
    'claimantName',
    'claimantEmail',
    'incidentState',
    'incidentDate',
    'atFault',
    'attorney',
    'settlement'
  ];
  
  // Create CSV header
  const header = columns.join(',');
  
  // Create CSV rows
  const rows = leads.map(lead => {
    return columns.map(column => {
      // Format boolean values to Yes/No
      if (typeof lead[column] === 'boolean') {
        return lead[column] ? 'Yes' : 'No';
      }
      
      // Handle empty values
      if (lead[column] === undefined || lead[column] === null) {
        return '';
      }
      
      // Escape commas in string values
      if (typeof lead[column] === 'string' && lead[column].includes(',')) {
        return `"${lead[column]}"`;
      }
      
      return lead[column];
    }).join(',');
  });
  
  // Combine header and rows
  return [header, ...rows].join('\n');
};

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
    
    // Save to lead history
    saveLeadToHistory(leadData, 'success');
    
    return response.data;
  } catch (error) {
    console.error('Error submitting lead:', error);
    
    // Save failed submission to history
    saveLeadToHistory(leadData, 'failed');
    
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
  submitTortLead,
  getSubmittedLeads,
  exportLeadsToCSV
}; 