import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import PasswordChangeModal from './PasswordChangeModal'; // Import PasswordChangeModal

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
    <div className="profile-container">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="profile-info mb-6">
        <div>
          <p>
            <strong>Name:</strong>{' '}
            {isEditing ? (
              <input
                type="text"
                name="name"
                defaultValue={user.name}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            ) : (
              user.name
            )}
          </p>
          <p>
            <strong>Email:</strong>{' '}
            {isEditing ? (
              <input
                type="email"
                name="email"
                defaultValue={user.email}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            ) : (
              user.email
            )}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </div>
      </div>

<div className='grid grid-cols-3'>
<div className="">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveChanges}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={openPasswordModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Change Password
        </button>
      </div>

      

      <div className="mt-6">
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
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
