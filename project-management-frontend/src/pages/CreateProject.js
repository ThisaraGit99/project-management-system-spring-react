import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/projectApi';
import { AuthContext } from '../context/AuthContext';
import { AiOutlineLoading3Quarters, AiOutlineCheckCircle } from 'react-icons/ai';
import Sidebar from '../components/Sidebar';

const CreateProject = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('IN_PROGRESS'); // Default status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Success message state
  const navigate = useNavigate();

  // Validate inputs
  const validateInputs = () => {
    if (!projectName.trim()) return 'Project name is required.';
    if (!description.trim()) return 'Project description is required.';
    return null;
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
  
    if (!isAuthenticated || !user || !user.id) {
      console.error('User is not logged in or user ID is missing');
      setError('You need to be logged in as an admin to create a project.');
      return;  // Stop execution if the user is not authenticated
    }
  
    setLoading(true);  // Start loading state
    setError(null);    // Clear previous errors
  
    try {
      // Prepare the project data to send to the backend
      const projectData = {
        projectName,
        description,
        createdBy: user.id,
        status, // Send the selected status
      };
  
      // Make API call to create the project
      const newProject = await createProject(projectData);
  
      setSuccess('Project created successfully!');  // Set success message
      setLoading(false);
      setTimeout(() => {
        navigate('/projects');  // Navigate to the projects page after a brief success message
      }, 2000);  // Wait 2 seconds before navigating
    } catch (err) {
      console.error('Error creating project:', err);
      setLoading(false);
      setError('Error creating the project. Please try again.');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Sidebar />
      <h2 className="text-2xl font-semibold text-center mb-6">Create New Project</h2>
      
      <form onSubmit={handleCreateProject} className="space-y-6">
        <div>
          <label className="block text-lg font-medium">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Project Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none disabled:opacity-50"
          >
            {loading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                Creating...
              </>
            ) : (
              'Create Project'
            )}
          </button>

          {loading && <p className="text-gray-500">Processing...</p>}
        </div>

        {error && (
          <p className="text-red-500 text-center font-semibold">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-center font-semibold flex items-center justify-center">
            <AiOutlineCheckCircle className="mr-2" />
            {success}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateProject;
