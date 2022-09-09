import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import { msalInstance } from './helpers';
import { StoresProvider } from "./stores";
import App from './App';
import './index.css';

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
