package com.projectmanagement.controller;

import com.projectmanagement.dto.PasswordChangeRequest;
import com.projectmanagement.dto.UserDetailsResponse;
import com.projectmanagement.exception.CustomException;
import com.projectmanagement.model.AuthRequest;
import com.projectmanagement.model.User;
import com.projectmanagement.security.JwtUtil;
import com.projectmanagement.service.CustomUserDetailsService;
import com.projectmanagement.service.UserService;
import com.projectmanagement.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private UserRepository userRepository; // Ensure this is injected into your class


    // Test endpoint (for testing purposes)
    @GetMapping("auth/test")
    public String testEndpoint() {
        return "API is working";
    }

    // Register a new user
    @PostMapping("auth/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            if (userService.existsByEmail(user.getEmail())) {
                return new ResponseEntity<>("Email is already taken", HttpStatus.BAD_REQUEST);
            }
            userService.createUser(user); // UserService handles password encoding
            return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error registering user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Login endpoint that returns a JWT token
    @PostMapping("auth/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest authRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );

            UserDetails userDetails = customUserDetailsService.loadUserByUsername(authRequest.getEmail());
            String token = jwtUtil.generateToken(userDetails);
            return new ResponseEntity<>(token, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    // Get all users (secured)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public List<UserDetailsResponse> getAllUsers() {
        return userService.getAllUsers()
                .stream()
                .map(user -> new UserDetailsResponse(user.getId(), user.getEmail(), user.getName(), user.getRole()))
                .collect(Collectors.toList());
    }

    // Create a new user (secured)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // Get user by ID (secured)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public UserDetailsResponse getUserById(@PathVariable int id) {
        User user = userService.getUserById(id);
        return new UserDetailsResponse(user.getId(), user.getEmail(), user.getName(), user.getRole());
    }

    // Update a user (secured)

//    @PutMapping("/{id}")
//    public User updateUser(@PathVariable int id, @RequestBody User user) {
//        return userService.updateUser(id, user);
//    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<?> updateUser(@PathVariable int id, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(updatedUser);
        } catch (CustomException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the user.");
        }
    }

    @PutMapping("/{id}/change-password")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<String> changePassword(
            @PathVariable int id,
            @Valid @RequestBody PasswordChangeRequest passwordChangeRequest) {
        try {
            logger.debug("Password change request received for user ID: {}", id);

            userService.updatePassword(id, passwordChangeRequest);
            return ResponseEntity.ok("Password updated successfully.");
        } catch (CustomException e) {
            logger.error("Business error while changing password: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error during password change", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred. Please try again later.");
        }
    }





    // Endpoint for deleting a user (secured for admin only)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable int id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully.");
        } catch (CustomException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    // Get details of the authenticated user
    @GetMapping("auth/me")
    public UserDetailsResponse getAuthenticatedUser(Principal principal) {
        String email = principal.getName();
        return userService.getUserDetailsByEmail(email);
    }

//    // Get user details from token
//    @GetMapping("auth/me/token")
//    public UserDetailsResponse getUserFromToken(@RequestHeader("Authorization") String token) {
//        String jwtToken = token.substring(7); // Remove "Bearer " prefix
//        String email = jwtUtil.extractUsername(jwtToken);
//        return userService.getUserDetailsByEmail(email);
//    }

    // Get details of the authenticated user for profile page
    @GetMapping("/profile")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')") // Allow both ADMIN and USER roles
    public ResponseEntity<UserDetailsResponse> getUserProfile(Authentication authentication) {
        try {
            // Debugging Authentication
            System.out.println("Authentication Object: " + authentication);

            String email = authentication.getName();
            UserDetailsResponse userDetails = userService.getUserDetailsByEmail(email);

            return ResponseEntity.ok(userDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // Return an error response for unexpected failures
        }
    }



}
