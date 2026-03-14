package com.financeapp.controller;

import com.financeapp.dto.GoalDTO.ContributeRequest;
import com.financeapp.dto.GoalDTO.Request;
import com.financeapp.dto.GoalDTO.Response;
import com.financeapp.model.Goal.GoalStatus;
import com.financeapp.model.User;
import com.financeapp.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public ResponseEntity<List<Response>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(goalService.getGoals(user));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Response>> filterByStatus(
            @AuthenticationPrincipal User user,
            @RequestParam GoalStatus status) {
        return ResponseEntity.ok(goalService.getGoalsByStatus(user, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getOne(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(goalService.getGoal(user, id));
    }

    @PostMapping
    public ResponseEntity<Response> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(goalService.createGoal(user, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response> update(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody Request request) {
        return ResponseEntity.ok(goalService.updateGoal(user, id, request));
    }

    @PostMapping("/{id}/contribute")
    public ResponseEntity<Response> contribute(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody ContributeRequest request) {
        return ResponseEntity.ok(goalService.contribute(user, id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Response> updateStatus(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestParam GoalStatus status) {
        return ResponseEntity.ok(goalService.updateStatus(user, id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        goalService.deleteGoal(user, id);
        return ResponseEntity.noContent().build();
    }
}
