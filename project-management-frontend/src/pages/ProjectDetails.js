import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProjectDetails } from "../api/projectApi";
import { getUserById } from "../api/userApi"; // Function to fetch user data
import { getAssignmentsByProject } from "../api/projectApi"; // Function to get project assignments
import { FaUserCircle } from "react-icons/fa";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [createdByName, setCreatedByName] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]); // Store assigned users
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        // Fetch project data
        const projectData = await getProjectDetails(projectId);
        setProject(projectData);

        // Fetch creator's name
        if (projectData.createdBy) {
          const userData = await getUserById(projectData.createdBy);
          setCreatedByName(userData?.name);
        }

        // Fetch assigned users for the project using the existing API
        const assignmentsData = await getAssignmentsByProject(projectId); // Fetch assignments
        console.log("Assignments data:", assignmentsData); // Log the assignments data for debugging

        // Assuming 'user' is part of each assignment
        const users = assignmentsData.map(assignment => assignment.user); 
        console.log("Users extracted from assignments:", users); // Log the extracted user data

        setAssignedUsers(users);
      } catch (err) {
        setError("Error fetching project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  // Format date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-500">Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-500">No project details available.</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 shadow-md rounded-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{project.projectName}</h1>
          <span className="px-4 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
            {project.status}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Created At */}
          <div>
            <span className="font-medium">Created At:</span> {formatDate(project.createdAt)}
          </div>

          {/* Created By */}
          <div>
            <span className="font-medium">Created By:</span>{" "}
            {createdByName ? (
              <div className="flex items-center gap-2 px-3 py-1 border rounded-full bg-gray-100">
                <FaUserCircle className="text-gray-500" />
                <span>{createdByName}</span>
              </div>
            ) : (
              "Unknown"
            )}
          </div>

          {/* Description */}
          <div>
            <span className="font-medium">Description:</span>
            <p className="mt-2 text-gray-700">{project.description}</p>
          </div>
        </div>

        {/* Assigned Users */}
        <div className="mt-6">
          <h2 className="text-xl font-medium">Assigned Users</h2>
          <div className="space-y-2">
            {assignedUsers.length > 0 ? (
              assignedUsers.map((user, index) => (
                user && user.name ? ( // Ensure user is defined and has a name
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaUserCircle className="text-gray-500" />
                      <span>{user.name}</span>
                    </div>
                    <div>
                      {/* Optional: Checkbox to remove user if desired */}
                      <MdCheckBox className="text-green-500 cursor-pointer" />
                    </div>
                  </div>
                ) : (
                  <div key={index}>User data is incomplete.</div>
                )
              ))
            ) : (
              <div>No users assigned yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
