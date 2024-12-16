import React, { useEffect, useContext ,useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import DashboardIcon from '@mui/icons-material/Dashboard';
import ProjectIcon from '@mui/icons-material/Folder';
import TaskIcon from '@mui/icons-material/Task';
import PersonIcon from '@mui/icons-material/Person';
import Sidebar from '../components/Sidebar';

const Dashboard = ({ user }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // useState to manage loading state

  useEffect(() => {
    // Wait until the authentication state is determined
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if no token is found
    } else {
      setLoading(false); // Authentication confirmed
    }
  }, [navigate]);

  if (loading) {
    // Show a loading message until the auth state is determined
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
        <p className="mt-4 text-lg">
          {user?.name ? `Hello, ${user.name}!` : 'Loading...'}
        </p>
      </main>
    </div>
  );
};

export default Dashboard;
