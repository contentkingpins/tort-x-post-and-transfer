import React from 'react';
import { Amplify } from 'aws-amplify';
import MainLayout from './layouts/MainLayout';
import TortLeadForm from './components/TortLeadForm';
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

function App() {
  return (
    <>
      <GlobalStyles />
      <MainLayout title="Tort Lead Transfer Form">
        <TortLeadForm />
      </MainLayout>
    </>
  );
}

export default App; 