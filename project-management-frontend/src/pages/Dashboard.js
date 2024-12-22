import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { CheckCircle, HourglassEmpty, PendingActions } from "@mui/icons-material";
import { Assignment, DoneAll, Work } from "@mui/icons-material";
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  // Dummy data for projects
  const projects = [
    {
      id: 1,
      taskName: "Finalize UI design",
      assignedTo: "Phoenix Winters",
      status: "In Progress",
    },
    {
      id: 2,
      taskName: "Backend API integration",
      assignedTo: "Cohen Merritt",
      status: "Pending",
    },
    {
      id: 3,
      taskName: "Code review for feature X",
      assignedTo: "Lukas Juarez",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Sidebar />
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2 flex items-center">
          <Work fontSize="large" className="mr-2 text-blue-500" /> Good Evening, John!
        </h1>
        <div className="flex space-x-6">
          <div className="bg-white p-4 shadow rounded-lg flex items-center">
            <Assignment className="text-gray-500 mr-2" />
            <div>
              <p className="text-gray-500">Total Projects</p>
              <p className="text-xl font-bold">10</p>
            </div>
          </div>
          <div className="bg-white p-4 shadow rounded-lg flex items-center">
            <DoneAll className="text-green-500 mr-2" />
            <div>
              <p className="text-gray-500">Projects Completed</p>
              <p className="text-xl font-bold">4</p>
            </div>
          </div>
          <div className="bg-white p-4 shadow rounded-lg flex items-center">
            <HourglassEmpty className="text-yellow-500 mr-2" />
            <div>
              <p className="text-gray-500">Projects In-Progress</p>
              <p className="text-xl font-bold">6</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Table */}
      <div className="bg-white p-6 shadow rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">My Projects</h2>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-200">
              <TableCell>Task Name</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.taskName}</TableCell>
                <TableCell>{project.assignedTo}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {project.status === "In Progress" && (
                      <PendingActions className="text-yellow-500 mr-1" />
                    )}
                    {project.status === "Pending" && (
                      <HourglassEmpty className="text-red-500 mr-1" />
                    )}
                    {project.status === "Completed" && (
                      <CheckCircle className="text-green-500 mr-1" />
                    )}
                    <span>{project.status}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Notes Section */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Notes</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li>Prepare for the team meeting tomorrow.</li>
          <li>Review API documentation for task assignment.</li>
          <li>Ensure deployment pipeline is tested.</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
