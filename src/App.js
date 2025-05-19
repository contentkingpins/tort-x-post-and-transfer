import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import styled from 'styled-components';
import MainLayout from './layouts/MainLayout';
import TortLeadForm from './components/TortLeadForm';
import LeadHistory from './components/LeadHistory';
import GlobalStyles from './styles/GlobalStyles';

// Configure Amplify
// Note: You will need to replace these values with your actual AWS Amplify configuration
const amplifyConfig = {
  Auth: {
    mandatorySignIn: false,
    region: 'us-east-1',
    userPoolId: 'REPLACE_WITH_USER_POOL_ID',
    userPoolWebClientId: 'REPLACE_WITH_USER_POOL_WEB_CLIENT_ID',
    identityPoolId: 'REPLACE_WITH_IDENTITY_POOL_ID',
  },
  API: {
    endpoints: [
      {
        name: 'tortLeadApi',
        endpoint: 'https://display.ringba.com/enrich/263344012027051643'
      }
    ]
  }
};

Amplify.configure(amplifyConfig);

// Navigation related styles
const NavContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
`;

const NavButton = styled.button`
  background-color: ${props => props.active ? '#003366' : 'transparent'};
  color: ${props => props.active ? 'white' : '#003366'};
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: ${props => props.active ? '3px solid #003366' : 'none'};
  
  &:hover {
    background-color: ${props => props.active ? '#003366' : '#e9ecef'};
  }
`;

function App() {
  const [activeView, setActiveView] = useState('form'); // 'form' or 'history'
  
  return (
    <>
      <GlobalStyles />
      <MainLayout title="Claim Connectors MVA Lead Form">
        <NavContainer>
          <NavButton 
            active={activeView === 'form'} 
            onClick={() => setActiveView('form')}
          >
            Submit Lead
          </NavButton>
          <NavButton 
            active={activeView === 'history'} 
            onClick={() => setActiveView('history')}
          >
            Lead History
          </NavButton>
        </NavContainer>
        
        {activeView === 'form' ? (
          <TortLeadForm />
        ) : (
          <LeadHistory />
        )}
      </MainLayout>
    </>
  );
}

export default App; 