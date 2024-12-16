import React, { useState, useEffect, useContext } from 'react';
import { getProjects } from '../api/projectApi';
import { getUserById } from '../api/userApi';  // Import the getUserById function
import { AuthContext } from '../context/AuthContext';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom'; // For redirecting to edit page

const Projects = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState({}); // Cache for users' names
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);
        setLoading(false);

        // Fetch the user names for all projects
        const userNames = {};
        for (let project of projectsData) {
          if (project.createdBy) {
            const userData = await getUserById(project.createdBy); // Fetch user data by ID
            userNames[project.createdBy] = userData.name;
          }
        }
        setUsers(userNames);
      } catch (err) {
        setError('Error fetching projects.');
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchProjects();
    }
  }, [isAuthenticated, user]);

  const handleAssignClick = (projectId) => {
    // Handle the assign logic here (for now, this is just a placeholder)
    console.log('Assign button clicked for project:', projectId);
  };

  const handleEditClick = (projectId) => {
    // Navigate to the edit page for the project
    navigate(`/projects/edit/${projectId}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">All Projects</h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
          <p className="ml-3 text-lg">Loading projects...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white border rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.projectName}</h3>
                <p className="text-gray-700 mb-4">{project.description}</p>
                <p className="text-gray-500 mb-2">
                  <strong>Status:</strong> {project.status}
                </p>
                <p className="text-gray-500 mb-2">
                  <strong>Created By:</strong> {users[project.createdBy] || 'Loading...'}
                </p>

                {/* Button to assign user */}
                {user && user.role === 'ADMIN' && (
                  <>
                    <button
                      onClick={() => handleAssignClick(project.id)}
                      className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                      Assign User
                    </button>
                    <button
                      onClick={() => handleEditClick(project.id)}
                      className="mt-4 w-full py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none"
                    >
                      Edit Project
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
