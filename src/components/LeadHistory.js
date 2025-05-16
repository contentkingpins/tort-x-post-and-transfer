import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getSubmittedLeads, exportLeadsToCSV } from '../api/leadService';

const HistoryContainer = styled.div`
  margin-top: 2rem;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #003366;
`;

const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const LeadCount = styled.div`
  font-size: 0.9rem;
  color: #555;
`;

const ExportButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background-color: #218838;
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const RefreshButton = styled.button`
  background-color: #17a2b8;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-right: 0.5rem;
  
  &:hover {
    background-color: #138496;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-top: 1px solid #dee2e6;
  vertical-align: middle;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  background-color: ${props => props.status === 'success' ? '#d4edda' : '#f8d7da'};
  color: ${props => props.status === 'success' ? '#155724' : '#721c24'};
`;

const NoLeadsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  color: #6c757d;
`;

const LeadHistory = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load leads on component mount
  useEffect(() => {
    loadLeads();
  }, []);
  
  // Load leads from storage
  const loadLeads = () => {
    setIsLoading(true);
    const loadedLeads = getSubmittedLeads();
    // Sort by submitted date descending (newest first)
    loadedLeads.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    setLeads(loadedLeads);
    setIsLoading(false);
  };
  
  // Handle export to CSV
  const handleExport = () => {
    if (leads.length === 0) return;
    
    const csvContent = exportLeadsToCSV(leads);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `lead-history-${timestamp}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  };
  
  // Format date for display
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <HistoryContainer>
      <Title>Lead Submission History</Title>
      
      <ControlsRow>
        <LeadCount>
          {leads.length} leads submitted
        </LeadCount>
        
        <div>
          <RefreshButton onClick={loadLeads} disabled={isLoading}>
            Refresh
          </RefreshButton>
          <ExportButton onClick={handleExport} disabled={leads.length === 0 || isLoading}>
            Export to CSV
          </ExportButton>
        </div>
      </ControlsRow>
      
      {leads.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Source ID</Th>
              <Th>Submitted</Th>
              <Th>Claimant Name</Th>
              <Th>Phone</Th>
              <Th>State</Th>
              <Th>Attorney</Th>
              <Th>Change Rep</Th>
              <Th>Insurance</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.sourceId + lead.submittedAt}>
                <Td>{lead.sourceId}</Td>
                <Td>{formatDate(lead.submittedAt)}</Td>
                <Td>{lead.claimantName || 'N/A'}</Td>
                <Td>{lead.callerId}</Td>
                <Td>{lead.incidentState}</Td>
                <Td>{lead.attorney ? 'Yes' : 'No'}</Td>
                <Td>{lead.attorney && lead.seekingNewAttorney ? 'Yes' : 'No'}</Td>
                <Td>
                  {lead.hasInsurance === true ? (
                    <span>{lead.insuranceCoverage === 'both' ? 'Yes (Both)' : 
                           lead.insuranceCoverage === 'unsure' ? 'Yes (Unsure)' : 
                           lead.insuranceCoverage === 'none' ? 'Yes (None)' : 'Yes'}</span>
                  ) : lead.hasInsurance === false ? (
                    <span>No</span>
                  ) : (
                    <span>Unknown</span>
                  )}
                </Td>
                <Td>
                  <StatusBadge status={lead.status}>
                    {lead.status}
                  </StatusBadge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <NoLeadsMessage>
          No lead submissions found. Submit a lead to see it tracked here.
        </NoLeadsMessage>
      )}
    </HistoryContainer>
  );
};

export default LeadHistory; 