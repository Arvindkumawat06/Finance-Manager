package com.financeapp.service;

import com.financeapp.dto.TransactionDTO.Request;
import com.financeapp.dto.TransactionDTO.Response;
import com.financeapp.dto.TransactionDTO.Summary;
import com.financeapp.model.Transaction;
import com.financeapp.model.Transaction.TransactionType;
import com.financeapp.model.User;
import com.financeapp.repository.BudgetRepository;
import com.financeapp.repository.TransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;

    public TransactionService(TransactionRepository transactionRepository,
                               BudgetRepository budgetRepository) {
        this.transactionRepository = transactionRepository;
        this.budgetRepository      = budgetRepository;
    }

    public Page<Response> getTransactions(User user, Pageable pageable) {
        return transactionRepository
                .findByUserIdOrderByDateDesc(user.getId(), pageable)
                .map(this::toResponse);
    }

    public Page<Response> getTransactionsByType(User user, TransactionType type, Pageable pageable) {
        return transactionRepository
                .findByUserIdAndTypeOrderByDateDesc(user.getId(), type, pageable)
                .map(this::toResponse);
    }

    public Page<Response> getTransactionsByCategory(User user, String category, Pageable pageable) {
        return transactionRepository
                .findByUserIdAndCategoryOrderByDateDesc(user.getId(), category, pageable)
                .map(this::toResponse);
    }

    public Response getTransaction(User user, Long id) {
        return transactionRepository.findByIdAndUserId(id, user.getId())
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
    }

    @Transactional
    public Response createTransaction(User user, Request request) {
        Transaction tx = Transaction.builder()
                .user(user)
                .amount(request.getAmount())
                .description(request.getDescription())
                .category(request.getCategory())
                .type(request.getType())
                .date(request.getDate())
                .notes(request.getNotes())
                .build();
        transactionRepository.save(tx);

        if (request.getType() == TransactionType.EXPENSE) {
            budgetRepository.findActiveBudgetByUserAndCategory(
                    user.getId(), request.getCategory(), request.getDate()
            ).ifPresent(budget -> {
                budget.setSpentAmount(budget.getSpentAmount().add(request.getAmount()));
                budgetRepository.save(budget);
            });
        }
        return toResponse(tx);
    }

    @Transactional
    public Response updateTransaction(User user, Long id, Request request) {
        Transaction tx = transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));

        // Reverse old budget impact
        if (tx.getType() == TransactionType.EXPENSE) {
            budgetRepository.findActiveBudgetByUserAndCategory(
                    user.getId(), tx.getCategory(), tx.getDate()
            ).ifPresent(budget -> {
                BigDecimal corrected = budget.getSpentAmount().subtract(tx.getAmount());
                budget.setSpentAmount(corrected.max(BigDecimal.ZERO));
                budgetRepository.save(budget);
            });
        }

        tx.setAmount(request.getAmount());
        tx.setDescription(request.getDescription());
        tx.setCategory(request.getCategory());
        tx.setType(request.getType());
        tx.setDate(request.getDate());
        tx.setNotes(request.getNotes());
        tx.setUpdatedAt(LocalDateTime.now());
        transactionRepository.save(tx);

        // Apply new budget impact
        if (request.getType() == TransactionType.EXPENSE) {
            budgetRepository.findActiveBudgetByUserAndCategory(
                    user.getId(), request.getCategory(), request.getDate()
            ).ifPresent(budget -> {
                budget.setSpentAmount(budget.getSpentAmount().add(request.getAmount()));
                budgetRepository.save(budget);
            });
        }
        return toResponse(tx);
    }

    @Transactional
    public void deleteTransaction(User user, Long id) {
        Transaction tx = transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));

        if (tx.getType() == TransactionType.EXPENSE) {
            budgetRepository.findActiveBudgetByUserAndCategory(
                    user.getId(), tx.getCategory(), tx.getDate()
            ).ifPresent(budget -> {
                BigDecimal corrected = budget.getSpentAmount().subtract(tx.getAmount());
                budget.setSpentAmount(corrected.max(BigDecimal.ZERO));
                budgetRepository.save(budget);
            });
        }
        transactionRepository.delete(tx);
    }

    public Summary getSummary(User user) {
        BigDecimal totalIncome   = transactionRepository.sumAmountByUserIdAndType(user.getId(), TransactionType.INCOME);
        BigDecimal totalExpenses = transactionRepository.sumAmountByUserIdAndType(user.getId(), TransactionType.EXPENSE);
        long count = transactionRepository.findByUserIdOrderByDateDesc(
                user.getId(), Pageable.unpaged()).getTotalElements();
        return Summary.builder()
                .totalIncome(totalIncome)
                .totalExpenses(totalExpenses)
                .netBalance(totalIncome.subtract(totalExpenses))
                .transactionCount(count)
                .build();
    }

    private Response toResponse(Transaction tx) {
        return Response.builder()
                .id(tx.getId())
                .amount(tx.getAmount())
                .description(tx.getDescription())
                .category(tx.getCategory())
                .type(tx.getType())
                .date(tx.getDate())
                .notes(tx.getNotes())
                .createdAt(tx.getCreatedAt())
                .updatedAt(tx.getUpdatedAt())
                .build();
    }
}
