import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext); // Access authentication context

  return (
    <nav className="bg-blue-900 text-white py-4 shadow-md">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Left side: Brand name */}
        <h1 className="text-2xl font-bold">
          <Link to="/">Project Management</Link>
        </h1>

        {/* Right side: Links or profile options */}
        <div className="flex items-center space-x-6">
          {/* Dashboard link */}
          <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>

          {/* If user is authenticated, show profile and logout options */}
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="hover:text-gray-300">Profile</Link>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
