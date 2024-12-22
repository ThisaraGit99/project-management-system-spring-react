import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  CircularProgress,
} from '@mui/material';
import api from '../api/api'; // Ensure api.js is configured properly
import Sidebar from '../components/Sidebar';

const ViewMembers = () => {
  const [members, setMembers] = useState([]); // Stores all users
  const [filteredMembers, setFilteredMembers] = useState([]); // Stores filtered users
  const [searchTerm, setSearchTerm] = useState(''); // Tracks the search query
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState(''); // Tracks error messages

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await api.get('/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMembers(response.data);
        setFilteredMembers(response.data); // Initialize filtered list
      } catch (err) {
        setError('Failed to fetch users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on the search term
  useEffect(() => {
    const results = members.filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(results);
  }, [searchTerm, members]);

  return (
    <>
    <Sidebar / >
    <Box mt={8} p={2}>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: '900px', margin: '0 auto' }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          View Members
        </Typography>
        {error && (
          <Typography variant="body2" color="error" textAlign="center" mb={2}>
            {error}
          </Typography>
        )}
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Search Bar */}
            <TextField
              label="Search Users"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ marginBottom: 3 }}
            />
            {/* Users Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Role</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.role === 'ADMIN' ? 'Admin' : 'User'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>
    </Box>
    </>
  );
};

export default ViewMembers;
