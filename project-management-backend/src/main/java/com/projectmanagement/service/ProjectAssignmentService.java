package com.projectmanagement.service;

import com.projectmanagement.exception.DuplicateAssignmentException;
import com.projectmanagement.model.ProjectAssignment;
import com.projectmanagement.model.User;
import com.projectmanagement.repository.ProjectAssignmentRepository;
import com.projectmanagement.repository.UserRepository; // Import UserRepository
import com.projectmanagement.dto.ProjectAssignmentWithUsername;  // Import DTO
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectAssignmentService {

    private final ProjectAssignmentRepository projectAssignmentRepository;
    private final UserRepository userRepository;  // Declare UserRepository

    // Constructor-based Dependency Injection
    public ProjectAssignmentService(ProjectAssignmentRepository projectAssignmentRepository, UserRepository userRepository) {
        this.projectAssignmentRepository = projectAssignmentRepository;
        this.userRepository = userRepository;  // Inject UserRepository
    }

    /**
     * Assign a user to a project. Throws DuplicateAssignmentException if the user is already assigned.
     *
     * @param assignment ProjectAssignment object containing projectId and userId
     * @return Saved ProjectAssignmentWithUsername object
     */
    public ProjectAssignmentWithUsername assignUserToProject(ProjectAssignment assignment) {
        // Check if the user is already assigned to the project
        if (projectAssignmentRepository.existsByProjectIdAndUserId(assignment.getProjectId(), assignment.getUserId())) {
            throw new DuplicateAssignmentException("User is already assigned to this project.");
        }

        // Save the assignment to the repository
        ProjectAssignment savedAssignment = projectAssignmentRepository.save(assignment);

        // Fetch the user by userId (using userRepository)
        Optional<User> userOptional = userRepository.findById(assignment.getUserId());

        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");  // Handle case if user not found
        }

        User user = userOptional.get();

        // Return the assignment along with the username
        return new ProjectAssignmentWithUsername(
                savedAssignment.getAssignmentId(),
                savedAssignment.getProjectId(),
                user.getName(),  // Assign the username here
                savedAssignment.getAssignedAt()
        );
    }

    /**
     * Get all assignments for a specific project.
     *
     * @param projectId ID of the project
     * @return List of ProjectAssignment objects
     */
    public List<ProjectAssignment> getAssignmentsByProject(int projectId) {
        return projectAssignmentRepository.findByProjectId(projectId);
    }

    /**
     * Get all assignments for a specific user.
     *
     * @param userId ID of the user
     * @return List of ProjectAssignment objects
     */
    public List<ProjectAssignment> getAssignmentsByUser(int userId) {
        return projectAssignmentRepository.findByUserId(userId);
    }

    /**
     * Remove a user from a project.
     *
     * @param projectId ID of the project
     * @param userId ID of the user
     */
    @Transactional
    public void removeUserFromProject(int projectId, int userId) {
        // Check if the assignment exists
        if (!projectAssignmentRepository.existsByProjectIdAndUserId(projectId, userId)) {
            throw new EntityNotFoundException("Assignment with projectId " + projectId + " and userId " + userId + " does not exist.");
        }

        // Perform the deletion
        projectAssignmentRepository.deleteByProjectIdAndUserId(projectId, userId);
    }
}
