import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Import the Router component
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Wrap the entire App in BrowserRouter to provide context */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);