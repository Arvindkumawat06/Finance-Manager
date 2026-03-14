package com.financeapp.service;

import com.financeapp.dto.BudgetDTO.Request;
import com.financeapp.dto.BudgetDTO.Response;
import com.financeapp.model.Budget;
import com.financeapp.model.User;
import com.financeapp.repository.BudgetRepository;
import com.financeapp.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;

    public BudgetService(BudgetRepository budgetRepository,
                         TransactionRepository transactionRepository) {
        this.budgetRepository      = budgetRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<Response> getBudgets(User user) {
        return budgetRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<Response> getActiveBudgets(User user) {
        return budgetRepository.findActiveBudgetsByUserAndDate(user.getId(), LocalDate.now())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Response getBudget(User user, Long id) {
        return budgetRepository.findByIdAndUserId(id, user.getId())
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Budget not found with id: " + id));
    }

    @Transactional
    public Response createBudget(User user, Request request) {
        java.math.BigDecimal spent = transactionRepository.sumExpensesByUserAndCategoryAndDateRange(
                user.getId(), request.getCategory(),
                request.getStartDate(), request.getEndDate());

        Budget budget = Budget.builder()
                .user(user)
                .category(request.getCategory())
                .limitAmount(request.getLimitAmount())
                .spentAmount(spent)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .period(request.getPeriod())
                .build();

        return toResponse(budgetRepository.save(budget));
    }

    @Transactional
    public Response updateBudget(User user, Long id, Request request) {
        Budget budget = budgetRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Budget not found with id: " + id));

        budget.setCategory(request.getCategory());
        budget.setLimitAmount(request.getLimitAmount());
        budget.setStartDate(request.getStartDate());
        budget.setEndDate(request.getEndDate());
        budget.setPeriod(request.getPeriod());

        java.math.BigDecimal spent = transactionRepository.sumExpensesByUserAndCategoryAndDateRange(
                user.getId(), request.getCategory(),
                request.getStartDate(), request.getEndDate());
        budget.setSpentAmount(spent);

        return toResponse(budgetRepository.save(budget));
    }

    @Transactional
    public void deleteBudget(User user, Long id) {
        Budget budget = budgetRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Budget not found with id: " + id));
        budgetRepository.delete(budget);
    }

    private Response toResponse(Budget b) {
        return Response.builder()
                .id(b.getId())
                .category(b.getCategory())
                .limitAmount(b.getLimitAmount())
                .spentAmount(b.getSpentAmount())
                .remainingAmount(b.getRemainingAmount())
                .usagePercentage(b.getUsagePercentage())
                .startDate(b.getStartDate())
                .endDate(b.getEndDate())
                .period(b.getPeriod())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
