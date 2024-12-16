import axios from './api'; // Import the existing axios instance

// Fetch all users
export const getUsers = async () => {
  try {
    const token = sessionStorage.getItem('token');  // Get token from sessionStorage
    const response = await axios.get('/users', {
      headers: {
        Authorization: `Bearer ${token}`,  // Add the token to the Authorization header
      },
    });
    return response.data; // Return the list of users
  } catch (error) {
    console.error('Error fetching users:', error.response?.data || error.message); // Log the error details
    throw new Error('Error fetching users');
  }
};

// Fetch user by ID
export const getUserById = async (userId) => {
  try {
    const token = sessionStorage.getItem('token');  // Get token from sessionStorage
    const response = await axios.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,  // Add the token to the Authorization header
      },
    });
    return response.data; // Return the user data
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error.response?.data || error.message);
    throw new Error(`Error fetching user with ID ${userId}`);
  }
};

// Change user password
export const changePassword = async (userId, data) => {
  const token = sessionStorage.getItem('token');
  return axios.post(`/users/${userId}/password`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
