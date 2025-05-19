import axios from 'axios';

/**
 * Service for handling tort lead submissions to the Ringba API
 */
const API_URL = 'https://display.ringba.com/enrich/263344012027051643';

// Set to true to use mock API instead of real endpoint
const USE_MOCK_API = true;

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.timeout = 10000; // 10 seconds timeout

/**
 * Mock API for testing without making real network requests
 * @param {Object} leadData - The lead data
 * @returns {Promise} - Mock response
 */
const mockApiCall = (leadData) => {
  return new Promise((resolve) => {
    console.log('MOCK API CALL - No network request made');
    console.log('Lead data received:', leadData);
    
    // Simulate network delay
    setTimeout(() => {
      resolve({
        status: 'ok',
        message: 'Lead submitted successfully (MOCK)',
        lead_id: leadData.sourceId,
        timestamp: new Date().toISOString()
      });
    }, 1000); // 1 second delay
  });
};

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
    'seekingNewAttorney',
    'settlement',
    'hasInsurance',
    'insuranceCoverage'
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
    // Use mock API if enabled
    if (USE_MOCK_API) {
      const mockResponse = await mockApiCall(leadData);
      
      // Save to lead history
      saveLeadToHistory(leadData, 'success');
      
      return mockResponse;
    }
    
    // Create a new URLSearchParams object to properly format the request
    const params = new URLSearchParams();
    params.append('callerId', leadData.callerId);
    params.append('claimantName', leadData.claimantName || '');
    params.append('claimantEmail', leadData.claimantEmail || '');
    params.append('sourceId', leadData.sourceId);
    params.append('incidentState', leadData.incidentState);
    params.append('incidentDate', formatDate(leadData.incidentDate));
    params.append('atFault', leadData.atFault ? 'Yes' : 'No');
    params.append('attorney', leadData.attorney ? 'Yes' : 'No');
    params.append('seekingNewAttorney', leadData.seekingNewAttorney ? 'Yes' : 'No');
    params.append('settlement', leadData.settlement ? 'Yes' : 'No');
    params.append('hasInsurance', leadData.hasInsurance === true ? 'Yes' : leadData.hasInsurance === false ? 'No' : '');
    params.append('insuranceCoverage', leadData.insuranceCoverage || '');
    params.append('trustedFormCertURL', leadData.trustedFormCertURL || '');
    params.append('pubId', leadData.pubId || '');
    
    // Log the request for debugging
    console.log('Submitting lead to API:', API_URL);
    console.log('With params:', Object.fromEntries(params));
    
    // Alternative approach using fetch instead of axios to avoid CORS issues
    const response = await fetch(`${API_URL}?${params.toString()}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Save to lead history
    saveLeadToHistory(leadData, 'success');
    
    return data;
  } catch (error) {
    console.error('Error submitting lead:', error);
    
    // Save failed submission to history
    saveLeadToHistory(leadData, 'failed');
    
    // For debugging - log the full error
    console.log('Full error details:', error);
    
    // Handle different types of errors
    if (error.message === 'Network Error') {
      throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(`Server error: ${error.response.status} - ${error.response.data}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please try again later.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw error;
    }
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