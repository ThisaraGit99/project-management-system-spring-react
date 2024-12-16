import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject'; // Import the CreateProject page
import EditProject from './pages/EditProject'; // Import the EditProject page
import PrivateRoute from './utils/PrivateRoute';
import { AuthContext } from './context/AuthContext';
import './index.css';

const App = () => {
  return (
    <>
      <Navbar />
      {/* <Sidebar /> */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/create"
          element={
            <PrivateRoute>
              <CreateProject />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />

        {/* Edit Project Route */}
        <Route
          path="/projects/edit/:projectId" // :projectId will be dynamic
          element={
            <PrivateRoute>
              <EditProject />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
