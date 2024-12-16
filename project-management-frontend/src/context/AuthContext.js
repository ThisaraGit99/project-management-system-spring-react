import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // Initialize authentication state on component mount
    useEffect(() => {
        const token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage
        const userData = sessionStorage.getItem('user'); // Retrieve user data from sessionStorage
        if (token && userData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userData)); // Parse and set the user data from sessionStorage
        }
    }, []);

    // Login function to save the token and user data in sessionStorage
    const login = (token, userData) => {
        sessionStorage.setItem('token', token); // Store token in sessionStorage
        sessionStorage.setItem('user', JSON.stringify(userData)); // Store user data in sessionStorage
        setIsAuthenticated(true);
        setUser(userData); // Store user data in state for easy access
    };

    // Logout function to clear the token and user data and reset state
    const logout = () => {
        sessionStorage.removeItem('token'); // Remove token from sessionStorage
        sessionStorage.removeItem('user'); // Remove user data from sessionStorage
        setIsAuthenticated(false);
        setUser(null);
        window.location.href = '/login'; // Redirect to login page
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
