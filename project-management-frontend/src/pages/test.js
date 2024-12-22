import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api'; // Import the existing api.js for API calls

const AddMembers = ({ projectId }) => {
  const [users, setUsers] = useState([]); // State for storing users
  const [selectedUsers, setSelectedUsers] = useState([]); // State for selected users to assign
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all users when component is mounted
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await api.get('/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
      }
    };
    
    fetchUsers();
  }, []);

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      setError('Please select at least one user to assign.');
      return;
    }

    setLoading(true); // Start loading
    try {
      const token = sessionStorage.getItem('token');
      // Prepare the assignment data
      const assignments = selectedUsers.map(userId => ({
        projectId,
        userId,
      }));

      // Send the assignment requests to backend
      await api.post('/projects/project-assignments', assignments, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Redirect to project details page after successful assignment
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError('Failed to assign users to the project. Please try again.');
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers((prevState) => 
      prevState.includes(userId) 
        ? prevState.filter((id) => id !== userId) // Deselect user if already selected
        : [...prevState, userId] // Select the user
    );
  };

  return (
    <div className="mt-32 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Add Members to Project</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Select Users to Add</h3>
          <div>
            {users.map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  value={user.id}
                  onChange={() => handleUserSelection(user.id)}
                  checked={selectedUsers.includes(user.id)}
                  className="rounded-md"
                />
                <span>{user.name}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddMembers}
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            {loading ? 'Adding Members...' : 'Add Members'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMembers;
