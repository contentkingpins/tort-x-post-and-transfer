# Tort Lead Transfer System

A React application built with AWS Amplify for collecting tort lead information and transferring it to buyers through the Ringba API.

## Features

- Form for collecting tort lead information from agents
- Validation of form fields
- API integration with Ringba for lead transfer
- Responsive UI with modern design
- AWS Amplify integration for easy deployment and scalability

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- AWS account (for Amplify deployment)
- AWS Amplify CLI (for deployment)

## Getting Started

### Installation

1. Clone this repository
```
git clone <repository-url>
```

2. Install dependencies
```
npm install
```

3. Configure AWS Amplify
```
amplify init
```

4. Update the Amplify configuration in `src/App.js` with your actual AWS resources:
```javascript
const amplifyConfig = {
  Auth: {
    mandatorySignIn: false,
    region: 'your-region',
    userPoolId: 'your-user-pool-id',
    userPoolWebClientId: 'your-web-client-id',
    identityPoolId: 'your-identity-pool-id',
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
```

### Running Locally

```
npm start
```

The application will run at [http://localhost:3000](http://localhost:3000)

### Building for Production

```
npm run build
```

This will create a production-ready build in the `build` directory.

### Deploying to AWS Amplify

```
amplify publish
```

## Project Structure

- `/src` - Source code
  - `/components` - React components
  - `/layouts` - Layout components
  - `/api` - API service code
  - `/utils` - Utility functions
  - `/styles` - Global styles
  - `/assets` - Static assets

## Customizing the Form

You can customize the form fields in `src/components/TortLeadForm.js` to match your specific requirements.

## API Integration

The application is configured to send form data to the Ringba API. You can modify the API endpoint and parameters in `src/api/leadService.js`. # tort-x-post-and-transfer
