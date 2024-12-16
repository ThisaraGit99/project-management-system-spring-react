package com.projectmanagement.controller;

import com.projectmanagement.exception.CustomException;
import com.projectmanagement.model.Project;
import com.projectmanagement.payload.ProjectRequest;
import com.projectmanagement.service.ProjectService;
import com.projectmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    // Get all projects
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    // Create a new project
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping()
    public ResponseEntity<Object> createProject(@RequestBody ProjectRequest projectRequest) {
        Project project = new Project();

        // Set project properties
        project.setProjectName(projectRequest.getProjectName());
        project.setDescription(projectRequest.getDescription());

        // Set default status if not provided
        if (projectRequest.getStatus() == null || projectRequest.getStatus().isEmpty()) {
            project.setStatus("IN_PROGRESS");  // Default status
        } else {
            project.setStatus(projectRequest.getStatus());  // Use provided status
        }

        // Extract the email from the JWT token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        // Fetch the user ID dynamically
        try {
            int userId = userService.getUserIdByEmail(email);
            project.setCreatedBy(userId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Unable to find user ID for email: " + email);
        }

        // Save the project using projectService
        Project createdProject = projectService.createProject(project);

        // Return the created project along with a success message
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);  // Returning the created project
    }



    // Get project by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<Project> getProjectById(@PathVariable int id) {
        return projectService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update a project
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Project> updateProject(@PathVariable int id, @RequestBody Project project) {
        try {
            Project updatedProject = projectService.updateProject(id, project);
            return ResponseEntity.ok(updatedProject);
        } catch (CustomException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // Return 400 for bad requests
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);  // Return 500 for other errors
        }
    }


    // Delete a project
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> deleteProject(@PathVariable int id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok("Project deleted successfully");
    }

    // Find projects by status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<List<Project>> getProjectsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(projectService.getProjectsByStatus(status));
    }

    // Find projects created by a specific user
    @GetMapping("/creator/{createdBy}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<List<Project>> getProjectsByCreator(@PathVariable int createdBy) {
        return ResponseEntity.ok(projectService.getProjectsByCreator(createdBy));
    }
}
