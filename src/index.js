import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1c2333',
            color: '#e2e8f0',
            border: '1px solid rgba(251,191,36,0.25)',
            fontFamily: "'Sora', sans-serif",
            fontSize: '13px',
            borderRadius: '10px',
          },
          success: { iconTheme: { primary: '#f59e0b', secondary: '#0b0f1a' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#0b0f1a' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
