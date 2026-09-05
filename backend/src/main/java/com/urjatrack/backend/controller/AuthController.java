package com.urjatrack.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public String login() {
        return "Email/password login endpoint.";
    }

    @PostMapping("/signup")
    public String signup() {
        return "Email/password signup endpoint.";
    }
}
