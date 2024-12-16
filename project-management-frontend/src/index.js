import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
import App from './App';
import './index.css';  // Import Tailwind's CSS file
import AuthProvider from './context/AuthContext';


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>  {/* Wrap your app with BrowserRouter here */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
