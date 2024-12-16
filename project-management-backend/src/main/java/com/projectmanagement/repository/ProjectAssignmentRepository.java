package com.projectmanagement.repository;

import com.projectmanagement.model.ProjectAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectAssignmentRepository extends JpaRepository<ProjectAssignment, Integer> {
    List<ProjectAssignment> findByProjectId(int projectId);
    List<ProjectAssignment> findByUserId(int userId);
    boolean existsByProjectIdAndUserId(int projectId, int userId);
    void deleteByProjectIdAndUserId(int projectId, int userId);
}
