import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import PasswordChangeModal from './PasswordChangeModal'; // Import PasswordChangeModal
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to control modal for password change
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Fetch user profile data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserProfile = async () => {
        try {
          const token = sessionStorage.getItem('token'); // Use sessionStorage instead of localStorage
          if (!token) {
            setError('No token found.');
            setLoading(false);
            return;
          }

          const response = await axios.get('http://localhost:8080/api/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the JWT token in the Authorization header
            },
          });
          setUser(response.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError('Failed to load profile data.');
          setLoading(false);
        }
      };

      fetchUserProfile();
    }
  }, [isAuthenticated]);

  // Handle input changes for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save changes to user profile
  const handleSaveChanges = async () => {
    try {
      if (!user || !user.id) {
        setError("User ID is missing. Please try again.");
        return;
      }

      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        return;
      }

      // Merge updatedUser with existing user data
      const updatedData = {
        ...user,
        ...updatedUser, // Only overwrite fields that were edited
      };

      const response = await axios.put(
        `http://localhost:8080/api/users/${user.id}`, // Correct endpoint
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile updated successfully:", response.data);
      setUser(response.data); // Update user state with the response
      setIsEditing(false); // Exit editing mode
      setError(null);
    } catch (error) {
      console.error("Error updating user profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  // Cancel editing mode
  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedUser({});
  };

  // Open password change modal
  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  // Close password change modal
  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <Sidebar />
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Profile</h2>
      
      <div className="profile-info space-y-6">
        {/* User Information */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-700">Name:</p>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  defaultValue={user.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-700">{user.name}</p>
              )}
            </div>

            <div>
              <p className="font-semibold text-gray-700">Email:</p>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-700">{user.email}</p>
              )}
            </div>

            <div>
              <p className="font-semibold text-gray-700">Role:</p>
              <p className="text-gray-700">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Buttons */}
        <div className="flex justify-between items-center mt-6 space-x-4">
          <div className="flex space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveChanges}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 focus:outline-none"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Change Password Button */}
          <div>
            <button
              onClick={openPasswordModal}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Change Password
            </button>
          </div>

          {/* Logout Button */}
          <div>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 focus:outline-none"
            >
              Logout
            </button>
          </div>
        </div>

        
      </div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
        userId={user.id}
        token={sessionStorage.getItem('token')}
      />
    </div>
  );
};

export default Profile;
