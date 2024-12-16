import React from 'react';
import { Navigate } from 'react-router-dom';

// PrivateRoute checks for the token
const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem('token'); // You are storing the token in sessionStorage in the context

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" />;
  }

  // If token exists, render the children (protected component)
  return children;
};

export default PrivateRoute;
