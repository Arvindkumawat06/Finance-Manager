package com.financeapp.controller;

import com.financeapp.dto.TransactionDTO.Request;
import com.financeapp.dto.TransactionDTO.Response;
import com.financeapp.dto.TransactionDTO.Summary;
import com.financeapp.model.Transaction.TransactionType;
import com.financeapp.model.User;
import com.financeapp.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<Page<Response>> getAll(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 20, sort = "date") Pageable pageable) {
        return ResponseEntity.ok(transactionService.getTransactions(user, pageable));
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<Response>> filterByType(
            @AuthenticationPrincipal User user,
            @RequestParam TransactionType type,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(transactionService.getTransactionsByType(user, type, pageable));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<Response>> filterByCategory(
            @AuthenticationPrincipal User user,
            @PathVariable String category,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(transactionService.getTransactionsByCategory(user, category, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getOne(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransaction(user, id));
    }

    @GetMapping("/summary")
    public ResponseEntity<Summary> getSummary(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(transactionService.getSummary(user));
    }

    @PostMapping
    public ResponseEntity<Response> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.createTransaction(user, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response> update(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody Request request) {
        return ResponseEntity.ok(transactionService.updateTransaction(user, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        transactionService.deleteTransaction(user, id);
        return ResponseEntity.noContent().build();
    }
}
