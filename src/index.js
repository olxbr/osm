import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import { msalInstance } from './helpers';
import { RootStoreProvider } from "./stores";
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <RootStoreProvider>
      <Router>
        <App msalInstance={msalInstance} />
      </Router>
    </RootStoreProvider>
  </React.Fragment>
);
