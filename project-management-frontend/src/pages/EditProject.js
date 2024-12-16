import React, { useState, useEffect } from 'react';
import { fetchAssignedUsers, fetchAllUsers, updateProject, getProjectDetails, removeUserFromProject, assignUserToProject } from '../api/projectApi';
import { AiOutlineClose } from 'react-icons/ai';
import { ClipLoader } from 'react-spinners';
import { useParams } from 'react-router-dom';

const EditProject = ({ onClose, onUpdate }) => {
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('IN_PROGRESS');
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!projectId) {
          setError('Project ID is missing.');
          return;
        }

        const project = await getProjectDetails(projectId);
        setProjectName(project.projectName);
        setDescription(project.description);
        setStatus(project.status);

        const assignments = await fetchAssignedUsers(projectId);
        setAssignedUsers(assignments);

        const users = await fetchAllUsers();
        // Filter out already assigned users
        const filteredUsers = users.filter(
          (user) => !assignments.some((assigned) => assigned.id === user.id)
        );
        setAvailableUsers(filteredUsers);
      } catch (err) {
        setError('Error fetching project details or users.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleSave = async () => {
    if (!projectName.trim()) {
      setError('Project Name is required.');
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user) {
        setError('No user logged in.');
        return;
      }

      const updatedProject = {
        projectName,
        description,
        status,
        createdBy: user.id,
      };

      await updateProject(projectId, updatedProject);

      onUpdate();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error saving project. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignUser = async (user) => {
    setAssignedUsers((prev) => [...prev, user]);
    setAvailableUsers((prev) => prev.filter((u) => u.id !== user.id));

    const assignment = {
      projectId: projectId,
      userId: user.id,
    };

    try {
      await assignUserToProject(assignment);
    } catch (error) {
      console.error('Error assigning user:', error);
      setAssignedUsers((prev) => prev.filter((u) => u.id !== user.id));
      setAvailableUsers((prev) => [...prev, user]);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      await removeUserFromProject(projectId, userId);
      const removedUser = assignedUsers.find((user) => user.id === userId);
      setAssignedUsers(assignedUsers.filter((user) => user.id !== userId));
      if (removedUser) setAvailableUsers((prev) => [...prev, removedUser]);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Project</h2>
          <AiOutlineClose onClick={onClose} className="cursor-pointer text-gray-500 hover:text-gray-700" />
        </div>
        {loading && <ClipLoader color="#000" size={50} />}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && (
          <>
            <div className="mt-4">
              <label className="block text-sm font-semibold">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full mt-2 px-3 py-2 border rounded"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-2 px-3 py-2 border rounded"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-2 px-3 py-2 border rounded"
              >
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Assigned Users</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {assignedUsers.length === 0 ? (
                  <span className="text-gray-500">No users assigned yet.</span>
                ) : (
                  assignedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {user.name}
                      <AiOutlineClose
                        className="cursor-pointer hover:text-blue-800"
                        onClick={() => handleRemoveUser(user.id)}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Available Users</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableUsers.length === 0 ? (
                  <span className="text-gray-500">No users available for assignment.</span>
                ) : (
                  availableUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleAssignUser(user)}
                      className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full"
                    >
                      {user.name}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={onClose} className="bg-gray-500 text-white rounded px-4 py-2">
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white rounded px-4 py-2 ml-2"
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditProject;
