import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { submitTortLead } from '../api/leadService';
import { validateForm } from '../utils/validation';

const FormContainer = styled.div`
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#dc3545' : '#ced4da'};
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4dabf7;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#dc3545' : '#ced4da'};
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #4dabf7;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SubmitButton = styled.button`
  background-color: #0062cc;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const DidTransferInfo = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #e2f0fd;
  border: 1px solid #b6d9f5;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DidNumber = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
  color: #0062cc;
`;

const TransferInstructions = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const ErrorAlert = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

// US States for dropdown
const US_STATES = [
  { value: '', label: 'Select a state' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' }
];

const TortLeadForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    isTest: false,
    callerId: '',
    claimantName: '',
    claimantEmail: '',
    sourceId: '',
    incidentState: '',
    incidentDate: '',
    atFault: false,
    attorney: false,
    settlement: false,
    trustedFormCertURL: '',
    pubId: 'Claim-Connectors'
  });
  
  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [transferDID, setTransferDID] = useState('');
  
  // Generate next sourceId on component mount
  useEffect(() => {
    generateNextSourceId();
  }, []);

  // Function to generate the next sourceId in sequence
  const generateNextSourceId = () => {
    // Get the last used ID from localStorage or start from 0
    const lastUsedId = parseInt(localStorage.getItem('lastSourceIdNumber') || '0', 10);
    
    // Calculate the next ID
    const nextId = lastUsedId + 1;
    
    // Format with leading zeros to ensure 6 digits
    const paddedId = nextId.toString().padStart(6, '0');
    const newSourceId = `CC${paddedId}`;
    
    // Save the next ID for future use
    localStorage.setItem('lastSourceIdNumber', nextId.toString());
    
    // Update the form state with the new sourceId
    setFormData(prevData => ({
      ...prevData,
      sourceId: newSourceId
    }));
    
    return newSourceId;
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // For checkboxes and radio buttons
    const inputValue = type === 'checkbox' || type === 'radio' ? checked : value;
    
    // Don't allow manual changes to sourceId as it's auto-generated
    if (name === 'sourceId') {
      return;
    }
    
    setFormData({
      ...formData,
      [name]: inputValue
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    // Submit form
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      const response = await submitTortLead(formData);
      
      // Check if the response indicates success
      if (response && response.status === 'ok') {
        setSubmitSuccess(true);
        
        // Set transfer DID number (this would come from the API response in a real app)
        // For demonstration, we're using a static number
        setTransferDID('1-800-555-7890');
        
        // Reset form but generate a new sourceId
        setFormData({
          isTest: false,
          callerId: '',
          claimantName: '',
          claimantEmail: '',
          sourceId: generateNextSourceId(), // Generate a new ID for the next lead
          incidentState: '',
          incidentDate: '',
          atFault: false,
          attorney: false,
          settlement: false,
          trustedFormCertURL: '',
          pubId: 'Claim-Connectors'
        });
        
        setErrors({});
      } else {
        setSubmitError('Lead submission failed. Please try again.');
      }
    } catch (error) {
      setSubmitError(`Error submitting lead: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormContainer>
      {submitSuccess && (
        <SuccessMessage>
          <div>Lead successfully submitted and transferred to the buyer!</div>
          
          <DidTransferInfo>
            <h3>Transfer Call Information</h3>
            <p>Use the following number to transfer this lead:</p>
            <DidNumber>{transferDID}</DidNumber>
            <TransferInstructions>
              1. Inform the claimant that you'll transfer them to a specialist<br />
              2. Place the current call on hold<br />
              3. Dial the number above<br />
              4. Complete the warm transfer once connected
            </TransferInstructions>
          </DidTransferInfo>
        </SuccessMessage>
      )}
      
      {submitError && (
        <ErrorAlert>
          {submitError}
        </ErrorAlert>
      )}
      
      <Form onSubmit={handleSubmit}>
        {/* Test Mode Toggle */}
        <FormGroup>
          <RadioOption>
            <input
              type="checkbox"
              id="isTest"
              name="isTest"
              checked={formData.isTest}
              onChange={handleChange}
            />
            <Label htmlFor="isTest">Test Mode</Label>
          </RadioOption>
        </FormGroup>
        
        {/* Caller ID / Phone Number */}
        <FormGroup>
          <Label htmlFor="callerId">Claimant's Phone Number*</Label>
          <Input
            type="tel"
            id="callerId"
            name="callerId"
            value={formData.callerId}
            onChange={handleChange}
            placeholder="(555) 555-5555"
            hasError={!!errors.callerId}
          />
          {errors.callerId && <ErrorMessage>{errors.callerId}</ErrorMessage>}
        </FormGroup>
        
        {/* Claimant Name */}
        <FormGroup>
          <Label htmlFor="claimantName">Claimant's Full Name</Label>
          <Input
            type="text"
            id="claimantName"
            name="claimantName"
            value={formData.claimantName}
            onChange={handleChange}
            placeholder="John Doe"
            hasError={!!errors.claimantName}
          />
          {errors.claimantName && <ErrorMessage>{errors.claimantName}</ErrorMessage>}
        </FormGroup>
        
        {/* Claimant Email */}
        <FormGroup>
          <Label htmlFor="claimantEmail">Claimant's Email</Label>
          <Input
            type="email"
            id="claimantEmail"
            name="claimantEmail"
            value={formData.claimantEmail}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            hasError={!!errors.claimantEmail}
          />
          {errors.claimantEmail && <ErrorMessage>{errors.claimantEmail}</ErrorMessage>}
        </FormGroup>
        
        {/* Source ID - Now Read-Only */}
        <FormGroup>
          <Label htmlFor="sourceId">Source ID (Auto-Generated)*</Label>
          <Input
            type="text"
            id="sourceId"
            name="sourceId"
            value={formData.sourceId}
            readOnly
            style={{ backgroundColor: '#f5f5f5' }}
          />
        </FormGroup>
        
        {/* Incident State */}
        <FormGroup>
          <Label htmlFor="incidentState">Incident State*</Label>
          <Select
            id="incidentState"
            name="incidentState"
            value={formData.incidentState}
            onChange={handleChange}
            hasError={!!errors.incidentState}
          >
            {US_STATES.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </Select>
          {errors.incidentState && <ErrorMessage>{errors.incidentState}</ErrorMessage>}
        </FormGroup>
        
        {/* Incident Date */}
        <FormGroup>
          <Label htmlFor="incidentDate">Incident Date*</Label>
          <Input
            type="text"
            id="incidentDate"
            name="incidentDate"
            value={formData.incidentDate}
            onChange={handleChange}
            placeholder="MM/DD/YYYY"
            hasError={!!errors.incidentDate}
          />
          {errors.incidentDate && <ErrorMessage>{errors.incidentDate}</ErrorMessage>}
        </FormGroup>
        
        {/* At Fault */}
        <FormGroup>
          <Label>Was the claimant at fault?</Label>
          <RadioGroup>
            <RadioOption>
              <input
                type="radio"
                id="atFaultYes"
                name="atFault"
                checked={formData.atFault === true}
                onChange={() => setFormData({...formData, atFault: true})}
              />
              <Label htmlFor="atFaultYes">Yes</Label>
            </RadioOption>
            <RadioOption>
              <input
                type="radio"
                id="atFaultNo"
                name="atFault"
                checked={formData.atFault === false}
                onChange={() => setFormData({...formData, atFault: false})}
              />
              <Label htmlFor="atFaultNo">No</Label>
            </RadioOption>
          </RadioGroup>
        </FormGroup>
        
        {/* Attorney */}
        <FormGroup>
          <Label>Does the claimant have an attorney?</Label>
          <RadioGroup>
            <RadioOption>
              <input
                type="radio"
                id="attorneyYes"
                name="attorney"
                checked={formData.attorney === true}
                onChange={() => setFormData({...formData, attorney: true})}
              />
              <Label htmlFor="attorneyYes">Yes</Label>
            </RadioOption>
            <RadioOption>
              <input
                type="radio"
                id="attorneyNo"
                name="attorney"
                checked={formData.attorney === false}
                onChange={() => setFormData({...formData, attorney: false})}
              />
              <Label htmlFor="attorneyNo">No</Label>
            </RadioOption>
          </RadioGroup>
        </FormGroup>
        
        {/* Settlement */}
        <FormGroup>
          <Label>Did the claimant receive a settlement for their injuries?</Label>
          <RadioGroup>
            <RadioOption>
              <input
                type="radio"
                id="settlementYes"
                name="settlement"
                checked={formData.settlement === true}
                onChange={() => setFormData({...formData, settlement: true})}
              />
              <Label htmlFor="settlementYes">Yes</Label>
            </RadioOption>
            <RadioOption>
              <input
                type="radio"
                id="settlementNo"
                name="settlement"
                checked={formData.settlement === false}
                onChange={() => setFormData({...formData, settlement: false})}
              />
              <Label htmlFor="settlementNo">No</Label>
            </RadioOption>
          </RadioGroup>
        </FormGroup>
        
        {/* Trusted Form Cert URL */}
        <FormGroup>
          <Label htmlFor="trustedFormCertURL">Trusted Form Cert URL</Label>
          <Input
            type="text"
            id="trustedFormCertURL"
            name="trustedFormCertURL"
            value={formData.trustedFormCertURL}
            onChange={handleChange}
            placeholder="https://cert.trustedform.com/..."
          />
        </FormGroup>
        
        {/* Publisher ID - Now Read-Only */}
        <FormGroup>
          <Label htmlFor="pubId">Publisher ID (Static)</Label>
          <Input
            type="text"
            id="pubId"
            name="pubId"
            value={formData.pubId}
            readOnly
            style={{ backgroundColor: '#f5f5f5' }}
          />
        </FormGroup>
        
        {/* Submit Button */}
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Lead'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default TortLeadForm; 