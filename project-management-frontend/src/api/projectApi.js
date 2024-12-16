import api from './api'; // Import the existing api instance

// Helper function to get the token
const getToken = () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    console.error('Authentication token is missing.');
    throw new Error('Authentication token is missing. Please log in.');
  }
  return token;
};

// Helper function to handle errors
const handleError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || 'An error occurred.';
  console.error(errorMessage);
  throw new Error(errorMessage);
};

// Create a new project
export const createProject = async (projectData) => {
  try {
    const token = getToken();
    const response = await api.post('/projects', projectData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch all projects
export const getProjects = async () => {
  try {
    const token = getToken();
    const response = await api.get('/projects', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch details of a single project
export const getProjectDetails = async (projectId) => {
  try {
    const token = getToken();
    const response = await api.get(`/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Update a project
export const updateProject = async (projectId, projectData) => {
  try {
    const token = getToken();
    const response = await api.put(`/projects/${projectId}`, projectData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Assign a user to a project (only admins)
export const assignUserToProject = async (assignment) => {
  try {
    const token = getToken();
    const response = await api.post('/projects/project-assignments', assignment, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Remove a user from a project
export const removeUserFromProject = async (projectId, userId) => {
  try {
    const token = getToken();
    const response = await api.delete(`/projects/project-assignments/project/${projectId}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch all assignments for a specific project
export const getAssignmentsByProject = async (projectId) => {
  try {
    const token = getToken();
    const response = await api.get(`/projects/project-assignments/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch all assignments for a specific user
export const getAssignmentsByUser = async (userId) => {
  try {
    const token = getToken();
    const response = await api.get(`/projects/project-assignments/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch users assigned to a specific project
export const fetchAssignedUsers = async (projectId) => {
  try {
    const token = getToken();
    const response = await api.get(`/projects/project-assignments/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch all users (for assigning to projects)
export const fetchAllUsers = async () => {
  try {
    const token = getToken();
    const response = await api.get('/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
