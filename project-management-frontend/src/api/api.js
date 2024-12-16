import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api', // Backend base URL
  headers: {
    'Content-Type': 'application/json', // Default headers
  },
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt'); // Retrieve token from sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for handling errors
api.interceptors.response.use(
  (response) => response, // Pass successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle token expiration or unauthorized access
      sessionStorage.removeItem('jwt'); // Clear the token from sessionStorage
      window.location.replace('/login'); // Redirect to login page
    }
    return Promise.reject(error); // Pass the error for further handling
  }
);

// API functions
export const assignUserToProject = async (assignment) => {
  // Assign a user to a project
  return api.post('/projects/project-assignments', assignment);
};

export const getAssignedUsers = async (projectId) => {
  // Get users assigned to a specific project
  const response = await api.get(`/projects/project-assignments/project/${projectId}`);
  return response.data; // Return only the data
};

export const removeAssignedUser = async (assignmentId) => {
  // Remove a user from a project
  return api.delete(`/projects/project-assignments/${assignmentId}`);
};

export default api;
