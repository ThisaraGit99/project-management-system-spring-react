package com.projectmanagement.payload;

public class ProjectRequest {
    private String projectName;
    private String description;
    private String status;  // Ensure this is defined

    // Getters and Setters

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;  // Getter for status
    }

    public void setStatus(String status) {
        this.status = status;  // Setter for status
    }
}
