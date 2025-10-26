package com.example.shodh_ai_contest_backend.controller;
import com.example.shodh_ai_contest_backend.dto.LoginRequest;
import com.example.shodh_ai_contest_backend.dto.JwtResponse;
import com.example.shodh_ai_contest_backend.model.User;
import com.example.shodh_ai_contest_backend.repository.UserRepository;
import com.example.shodh_ai_contest_backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtService jwtService) {

        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }


    // ---------- Login ----------
    @PostMapping("/login")
    public JwtResponse login(@RequestBody LoginRequest request) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // fetch user for role / id claims
        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);
        return new JwtResponse(token);          // { "token": "Bearer …" }
    }

    @PostMapping("/register")
    public JwtResponse register(@RequestBody LoginRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken");
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPasswordHash(
                new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
                        .encode(request.getPassword()));
        newUser.setRole(User.Role.CONTESTANT);
        userRepository.save(newUser);

        String token = jwtService.generateToken(newUser);
        return new JwtResponse(token);
    }



}
