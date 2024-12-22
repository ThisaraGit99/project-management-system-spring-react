import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import Navbar from '../components/Navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext); // Access login from AuthContext
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Both fields are required.');
            return;
        }

        setLoading(true); // Show loading state
        try {
            const response = await api.post('/users/auth/login', { email, password });

            // Log the full response for debugging purposes
            console.log("Full Login Response:", response);

            const token = response.data; // Token is returned directly in response.data

            // If the token is not in response.data, check if it's inside response.data.token
            // Uncomment below if response structure is { data: { token: 'your-token' } }
            // const token = response.data.token;

            if (token) {
                // Fetch the user data after login with the token
                const userResponse = await api.get('/users/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Assuming userResponse.data contains the user data
                const userData = userResponse.data;

                // Login and store the token and user data in AuthContext
                login(token, userData); // Save token and user data in AuthContext
                navigate('/dashboard'); // Navigate to the dashboard after successful login
            } else {
                setError('No token received. Please check server response.');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    return (
        <>
        <Navbar />
        <div className="mt-32 flex items-center justify-center bg-gray-100 overflow-hidden">
            
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center mt-4">
                    Don't have an account? <Link to="/register" className="text-blue-500 hover:text-blue-700">Register</Link>
                </p>
            </div>
        </div>
        </>
    );
};

export default Login;
