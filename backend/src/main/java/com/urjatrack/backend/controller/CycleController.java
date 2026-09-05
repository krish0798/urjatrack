package com.urjatrack.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cycles")
public class CycleController {

    @GetMapping("/active")
    public String getActiveCycle() {
        return "Active cycle info will be mapped here.";
    }
}
