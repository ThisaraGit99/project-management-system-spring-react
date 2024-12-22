import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
} from '@mui/material';
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
} from 'react-icons/fa';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const Sidebar = () => {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);

  const toggleProjects = () => setIsProjectsOpen(!isProjectsOpen);
  const toggleTasks = () => setIsTasksOpen(!isTasksOpen);
  const toggleMembers = () => setIsMembersOpen(!isMembersOpen);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        '& .MuiDrawer-paper': {
          width: 340,
          backgroundColor: '#1E293B', // Dark Navy Blue
          color: '#E2E8F0', // Off-white text
        },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          py: 2,
          fontWeight: 'bold',
          color: '#93C5FD', // Light Blue for the title
        }}
      >
        Project Management System
      </Typography>

      <List>
        {/* Dashboard Link */}
        <ListItemButton
          component={Link}
          to="/dashboard"
          sx={{
            '&:hover': { backgroundColor: '#334155' }, // Soft Blue hover effect
            '&.Mui-selected': {
              backgroundColor: '#2563EB', // Bright Blue for active link
              color: '#FFFFFF', // White text for active link
            },
          }}
        >
          <ListItemIcon>
            <FaTachometerAlt color="#93C5FD" /> {/* Light Blue icon */}
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {/* Projects Section */}
        <ListItemButton
          onClick={toggleProjects}
          sx={{
            '&:hover': { backgroundColor: '#334155' },
            '&.Mui-selected': { backgroundColor: '#2563EB', color: '#FFFFFF' },
          }}
        >
          <ListItemIcon>
            <FaProjectDiagram color="#93C5FD" />
          </ListItemIcon>
          <ListItemText primary="Projects" />
          {isProjectsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={isProjectsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4, '&:hover': { backgroundColor: '#334155' } }} component={Link} to="/projects">
              <ListItemText primary="Project Overview" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4, '&:hover': { backgroundColor: '#334155' } }} component={Link} to="/projects/create">
              <ListItemText primary="Create Project" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Tasks Section */}
        {/* <ListItemButton
          onClick={toggleTasks}
          sx={{
            '&:hover': { backgroundColor: '#334155' },
            '&.Mui-selected': { backgroundColor: '#2563EB', color: '#FFFFFF' },
          }}
        >
          <ListItemIcon>
            <FaTasks color="#93C5FD" />
          </ListItemIcon>
          <ListItemText primary="Tasks" />
          {isTasksOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={isTasksOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4, '&:hover': { backgroundColor: '#334155' } }} component={Link} to="/projects/ProjectDetails">
              <ListItemText primary="All Tasks" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4, '&:hover': { backgroundColor: '#334155' } }} component={Link} to="/test">
              <ListItemText primary="Pending Tasks" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4, '&:hover': { backgroundColor: '#334155' } }} component={Link} to="/tasks/completed">
              <ListItemText primary="Completed Tasks" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4, '&:hover': { backgroundColor: '#334155' } }} component={Link} to="/tasks/create">
              <ListItemText primary="Create Task" />
            </ListItemButton>
          </List>
        </Collapse> */}

        {/* Members Section */}
        <ListItemButton
          onClick={toggleMembers}
          sx={{
            '&:hover': { backgroundColor: '#334155' },
            '&.Mui-selected': { backgroundColor: '#2563EB', color: '#FFFFFF' },
          }}
        >
          <ListItemIcon>
            <FaUsers color="#93C5FD" />
          </ListItemIcon>
          <ListItemText primary="Members" />
          {isMembersOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={isMembersOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4, '&:hover': { backgroundColor: '#334155' } }} component={Link} to="/members/add">
              <ListItemText primary="Add Member" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4, '&:hover': { backgroundColor: '#334155' } }} component={Link} to="/members/view">
              <ListItemText primary="View Members" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Profile and Logout */}
        <ListItemButton
          component={Link}
          to="/profile"
          sx={{
            '&:hover': { backgroundColor: '#334155' },
            '&.Mui-selected': { backgroundColor: '#2563EB', color: '#FFFFFF' },
          }}
        >
          <ListItemIcon>
            <FaUserCircle color="#93C5FD" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/login"
          sx={{
            '&:hover': { backgroundColor: '#334155' },
            '&.Mui-selected': { backgroundColor: '#2563EB', color: '#FFFFFF' },
          }}
        >
          <ListItemIcon>
            <FaSignOutAlt color="#93C5FD" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
