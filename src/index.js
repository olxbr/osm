import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import { StoresProvider } from './stores';
import { msalConfig } from './config';
import App from './App';
import './index.css';

const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.enableAccountStorageEvents();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <StoresProvider>
      <Router>
        <App msalInstance={msalInstance} />
      </Router>
    </StoresProvider>
  </React.Fragment>
);
