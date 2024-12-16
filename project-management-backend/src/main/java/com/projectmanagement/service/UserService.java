package com.projectmanagement.service;

import com.projectmanagement.dto.PasswordChangeRequest;
import com.projectmanagement.dto.UserDetailsResponse;
import com.projectmanagement.exception.CustomException;
import com.projectmanagement.model.User;
import com.projectmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Constants for roles (optional but helps avoid errors due to hardcoded strings)
    public static final String ROLE_USER = "ROLE_USER";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Create a new user
    public User createUser(User user) {
        if (userRepository.existsById(user.getId())) {
            throw new CustomException("User already exists with ID: " + user.getId());
        }

        // Set the default role to 'ROLE_USER' if not provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole(ROLE_USER);  // Default to 'ROLE_USER' role
        }

        // Encode the password before saving the user
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Get user by ID
    public User getUserById(int id) {
        return userRepository.findById(id).orElseThrow(() ->
                new CustomException("User not found with ID: " + id));
    }

    // Update a user
    public User updateUser(int id, User user) {
        // Check if the user exists, otherwise throw an exception
        User existingUser = userRepository.findById(id).orElseThrow(() ->
                new CustomException("User not found with ID: " + id)
        );

        // Preserve the ID to ensure the correct user is updated
        user.setId(id);

        // Preserve `createdAt` field to prevent overwriting
        user.setCreatedAt(existingUser.getCreatedAt());

        // Preserve the role if not provided in the update request
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole(existingUser.getRole());
        }

        // Update only the fields provided in the request (add additional checks if needed)
        if (user.getName() != null) {
            existingUser.setName(user.getName());
        }
        if (user.getEmail() != null) {
            existingUser.setEmail(user.getEmail());
        }
        if (user.getPassword() != null) {
            existingUser.setPassword(user.getPassword());
        }
        if (user.getRole() != null) {
            existingUser.setRole(user.getRole());
        }

        // Save the updated user back to the database
        return userRepository.save(existingUser);
    }

    public void updatePassword(int id, PasswordChangeRequest request) {
        // Debugging input
        System.out.println("Updating password for User ID: " + id);
        System.out.println("Request Details: " + request);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomException("User not found with ID: " + id));

        // Debugging current password comparison
        System.out.println("Current Password from DB: " + user.getPassword());
        System.out.println("Current Password from Request: " + request.getCurrentPassword());

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new CustomException("Current password is incorrect.");
        }

        // Verify new password and confirmation match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new CustomException("New password and confirmation do not match.");
        }

        // Update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        System.out.println("Password updated successfully for User ID: " + id);
    }




    // Delete a user
    public void deleteUser(int id) {
        if (!userRepository.existsById(id)) {
            throw new CustomException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }

    // Method to register a new user with encoded password
    public User registerUser(User user) {
        // Set the default role to 'ROLE_USER' if not provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole(ROLE_USER);  // Default to 'ROLE_USER' role
        }

        // Encode the password before saving the user
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Check if a user exists by email
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // Fetch user ID by email
    public int getUserIdByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));
        return user.getId();
    }

    // Fetch user by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    // Fetch user details as a DTO by email
    public UserDetailsResponse getUserDetailsByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        // Map User entity to UserDetailsResponse DTO
        return new UserDetailsResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole() // Use the single role directly
        );
    }
}
