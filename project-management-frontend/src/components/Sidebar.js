import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaProjectDiagram, FaTasks, FaUsers, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
    
    const [isTasksOpen, setIsTasksOpen] = useState(false);
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);

    const toggleTasks = () => setIsTasksOpen(!isTasksOpen);
    const toggleProjects = () => setIsProjectsOpen(!isProjectsOpen);

    return (
        <div className="h-full w-64 bg-gray-800 text-white">
            <div className="p-4 flex items-center justify-center space-x-2">
                <h1 className="text-2xl font-bold">Project Management</h1>
            </div>

            <div className="mt-6 space-y-4">
                {/* Dashboard Link */}
                <Link to="/dashboard" className="flex items-center px-4 py-2 hover:bg-gray-700">
                    <FaTachometerAlt className="mr-2" /> Dashboard
                </Link>

                {/* Projects Section */}
                <div>
                    <button
                        onClick={toggleProjects}
                        className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-700"
                    >
                        <FaProjectDiagram className="mr-2" /> Projects
                    </button>
                    {isProjectsOpen && (
                        <div className="pl-6 space-y-2">
                            <Link to="/projects" className="flex items-center px-4 py-2 hover:bg-gray-700">
                                Project Overview
                            </Link>
                            <Link to="/projects/create" className="flex items-center px-4 py-2 hover:bg-gray-700">
                                Create Project
                            </Link>
                        </div>
                    )}
                </div>

                {/* Tasks Section */}
                <div>
                    <button
                        onClick={toggleTasks}
                        className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-700"
                    >
                        <FaTasks className="mr-2" /> Tasks
                    </button>
                    {isTasksOpen && (
                        <div className="pl-6 space-y-2">
                            <Link to="/tasks" className="flex items-center px-4 py-2 hover:bg-gray-700">
                                All Tasks
                            </Link>
                            <Link to="/tasks/pending" className="flex items-center px-4 py-2 hover:bg-gray-700">
                                Pending Tasks
                            </Link>
                            <Link to="/tasks/completed" className="flex items-center px-4 py-2 hover:bg-gray-700">
                                Completed Tasks
                            </Link>
                            <Link to="/tasks/create" className="flex items-center px-4 py-2 hover:bg-gray-700">
                                Create Task
                            </Link>
                        </div>
                    )}
                </div>

                {/* Admin Section: All Members */}
                <div>
                    <Link to="/members" className="flex items-center px-4 py-2 hover:bg-gray-700">
                        <FaUsers className="mr-2" /> All Members
                    </Link>
                    <Link to="/members/add" className="flex items-center px-4 py-2 hover:bg-gray-700">
                        Add Member
                    </Link>
                    <Link to="/members/view" className="flex items-center px-4 py-2 hover:bg-gray-700">
                        View Members
                    </Link>
                </div>

                {/* Profile and Logout */}
                <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-gray-700">
                    <FaUserCircle className="mr-2" /> Profile
                </Link>
                <Link to="/login" className="flex items-center px-4 py-2 hover:bg-gray-700">
                    <FaSignOutAlt className="mr-2" /> Logout
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
