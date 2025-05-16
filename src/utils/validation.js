/**
 * Validates form fields for the tort lead submission form
 */

/**
 * Validates a phone number
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a date string
 * @param {string} date - The date string to validate (MM/DD/YYYY)
 * @returns {boolean} - Whether the date is valid
 */
export const validateDate = (date) => {
  // Check format
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  if (!dateRegex.test(date)) {
    return false;
  }
  
  // Check if it's a valid date
  const parts = date.split('/');
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  const dateObj = new Date(year, month - 1, day);
  return dateObj.getMonth() === month - 1 && 
         dateObj.getDate() === day && 
         dateObj.getFullYear() === year;
};

/**
 * Validates a source ID
 * @param {string} sourceId - The source ID to validate
 * @returns {boolean} - Whether the source ID is valid
 */
export const validateSourceId = (sourceId) => {
  // The auto-generated format should be CC followed by 6 digits
  const sourceIdRegex = /^CC\d{6}$/;
  return sourceIdRegex.test(sourceId);
};

/**
 * Checks if accident date is more than 12 months old
 * @param {string} dateString - The date string to check (MM/DD/YYYY)
 * @returns {boolean} - Whether the date is more than 12 months old
 */
export const isDateTooOld = (dateString) => {
  if (!dateString) return false;
  
  // Parse the date (MM/DD/YYYY format)
  const parts = dateString.split('/');
  if (parts.length !== 3) return false;
  
  const accidentDate = new Date(parts[2], parts[0] - 1, parts[1]);
  const today = new Date();
  
  // Calculate the difference in months
  const monthsDiff = 
    (today.getFullYear() - accidentDate.getFullYear()) * 12 + 
    (today.getMonth() - accidentDate.getMonth());
  
  return monthsDiff > 12;
};

/**
 * Validates the entire form data
 * @param {Object} formData - The form data to validate
 * @returns {Object} - Object with validation results
 */
export const validateForm = (formData) => {
  const errors = {};
  
  // Required fields
  if (!formData.callerId) {
    errors.callerId = 'Phone number is required';
  } else if (!validatePhone(formData.callerId)) {
    errors.callerId = 'Please enter a valid phone number';
  }
  
  // SourceId is now auto-generated, but still validate it
  if (!formData.sourceId) {
    errors.sourceId = 'Source ID is required';
  } else if (!validateSourceId(formData.sourceId)) {
    errors.sourceId = 'Invalid Source ID format';
  }
  
  if (!formData.incidentState) {
    errors.incidentState = 'Incident state is required';
  }
  
  if (!formData.incidentDate) {
    errors.incidentDate = 'Incident date is required';
  } else if (!validateDate(formData.incidentDate)) {
    errors.incidentDate = 'Please enter a valid date (MM/DD/YYYY)';
  } else if (isDateTooOld(formData.incidentDate)) {
    errors.incidentDate = 'Accident date is more than 12 months old';
  }
  
  // Optional fields with validation
  if (formData.claimantEmail && !validateEmail(formData.claimantEmail)) {
    errors.claimantEmail = 'Please enter a valid email address';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  validatePhone,
  validateEmail,
  validateDate,
  validateSourceId,
  isDateTooOld,
  validateForm
}; 