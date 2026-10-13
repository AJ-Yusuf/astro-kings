import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import '@fontsource/readex-pro/latin-200.css';
import '@fontsource/readex-pro/latin-300.css';
import '@fontsource/readex-pro/latin-400.css';
import '@fontsource/readex-pro/latin-500.css';
import '@fontsource/readex-pro/latin-600.css';
import '@fontsource/readex-pro/latin-700.css';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
