import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ⬅️ IMPORT
import App from './App.tsx';
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* ROUTER SETUP: Enables all components inside App to use navigation */}
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);