import React, { useState, useEffect, useContext } from 'react';
import { getProjects } from '../api/projectApi';
import { getUserById } from '../api/userApi';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress, Grid, Typography, Card, CardContent, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Projects = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);
        setLoading(false);

        const userNames = {};
        for (let project of projectsData) {
          if (project.createdBy) {
            const userData = await getUserById(project.createdBy);
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
    navigate(`/projects/details/${projectId}`);
  };

  const handleEditClick = (projectId) => {
    navigate(`/projects/edit/${projectId}`);
  };

  return (
    <Box sx={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Sidebar />
      <Typography variant="h4" align="center" gutterBottom>
        All Projects
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ marginLeft: '16px' }}>
            Loading projects...
          </Typography>
        </Box>
      ) : error ? (
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} key={project.id}>
              <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {project.projectName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {project.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Status:</strong> {project.status}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Created By:</strong> {users[project.createdBy] || 'Loading...'}
                  </Typography>

                  {user && user.role === 'ADMIN' && (
                    <Box sx={{ marginTop: 2, display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#4CAF50',
                          color: '#fff',
                          flex: 1,
                          '&:hover': { backgroundColor: '#45A049' },
                        }}
                        onClick={() => handleAssignClick(project.id)}
                      >
                        More Details
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#FF9800',
                          color: '#fff',
                          flex: 1,
                          '&:hover': { backgroundColor: '#FB8C00' },
                        }}
                        onClick={() => handleEditClick(project.id)}
                      >
                        Edit Project
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Projects;
