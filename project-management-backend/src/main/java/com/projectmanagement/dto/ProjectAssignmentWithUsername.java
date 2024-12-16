package com.projectmanagement.dto;

import java.util.Date;

public class ProjectAssignmentWithUsername {
    private int assignmentId;
    private int projectId;
    private String name; // Updated from `username` to `name`
    private Date assignedAt;

    // Constructor
    public ProjectAssignmentWithUsername(int assignmentId, int projectId, String name, Date assignedAt) {
        this.assignmentId = assignmentId;
        this.projectId = projectId;
        this.name = name; // Updated from `username` to `name`
        this.assignedAt = assignedAt;
    }

    // Getters and Setters
    public int getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(int assignmentId) {
        this.assignmentId = assignmentId;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public String getName() { // Updated from `getUsername` to `getName`
        return name;
    }

    public void setName(String name) { // Updated from `setUsername` to `setName`
        this.name = name;
    }

    public Date getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(Date assignedAt) {
        this.assignedAt = assignedAt;
    }
}
