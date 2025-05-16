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
  
  if (!formData.sourceId) {
    errors.sourceId = 'Source ID is required';
  }
  
  if (!formData.incidentState) {
    errors.incidentState = 'Incident state is required';
  }
  
  if (!formData.incidentDate) {
    errors.incidentDate = 'Incident date is required';
  } else if (!validateDate(formData.incidentDate)) {
    errors.incidentDate = 'Please enter a valid date (MM/DD/YYYY)';
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
  validateForm
}; 