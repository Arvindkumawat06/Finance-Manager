package com.financeapp.controller;

import com.financeapp.dto.BudgetDTO.Request;
import com.financeapp.dto.BudgetDTO.Response;
import com.financeapp.model.User;
import com.financeapp.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<List<Response>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(budgetService.getBudgets(user));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Response>> getActive(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(budgetService.getActiveBudgets(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getOne(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudget(user, id));
    }

    @PostMapping
    public ResponseEntity<Response> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(budgetService.createBudget(user, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response> update(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody Request request) {
        return ResponseEntity.ok(budgetService.updateBudget(user, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        budgetService.deleteBudget(user, id);
        return ResponseEntity.noContent().build();
    }
}
