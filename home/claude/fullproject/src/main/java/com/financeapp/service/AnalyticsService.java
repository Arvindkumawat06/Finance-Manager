package com.financeapp.service;

import com.financeapp.dto.AnalyticsDTO.CategoryBreakdown;
import com.financeapp.dto.AnalyticsDTO.MonthlySummary;
import com.financeapp.dto.AnalyticsDTO.OverviewReport;
import com.financeapp.dto.AnalyticsDTO.SpendingTrend;
import com.financeapp.model.Goal.GoalStatus;
import com.financeapp.model.Transaction.TransactionType;
import com.financeapp.model.User;
import com.financeapp.repository.BudgetRepository;
import com.financeapp.repository.GoalRepository;
import com.financeapp.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class AnalyticsService {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final GoalRepository goalRepository;

    public AnalyticsService(TransactionRepository transactionRepository,
                             BudgetRepository budgetRepository,
                             GoalRepository goalRepository) {
        this.transactionRepository = transactionRepository;
        this.budgetRepository      = budgetRepository;
        this.goalRepository        = goalRepository;
    }

    public OverviewReport getOverview(User user) {
        LocalDate today      = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);

        BigDecimal monthlyIncome   = transactionRepository.sumAmountByUserIdAndTypeAndDateRange(
                user.getId(), TransactionType.INCOME, monthStart, today);
        BigDecimal monthlyExpenses = transactionRepository.sumAmountByUserIdAndTypeAndDateRange(
                user.getId(), TransactionType.EXPENSE, monthStart, today);
        BigDecimal totalIncome     = transactionRepository.sumAmountByUserIdAndType(
                user.getId(), TransactionType.INCOME);
        BigDecimal totalExpenses   = transactionRepository.sumAmountByUserIdAndType(
                user.getId(), TransactionType.EXPENSE);

        List<CategoryBreakdown> topCategories =
                buildCategoryBreakdowns(user.getId(), monthStart, today, monthlyExpenses);
        List<SpendingTrend> trends = buildMonthlyTrends(user.getId());

        long activeBudgets   = budgetRepository
                .countByUserIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        user.getId(), today, today);
        long goalsInProgress = goalRepository.countByUserIdAndStatus(
                user.getId(), GoalStatus.IN_PROGRESS);

        return OverviewReport.builder()
                .totalBalance(totalIncome.subtract(totalExpenses))
                .monthlyIncome(monthlyIncome)
                .monthlyExpenses(monthlyExpenses)
                .monthlySavings(monthlyIncome.subtract(monthlyExpenses))
                .topExpenseCategories(topCategories)
                .last6MonthsTrend(trends)
                .activeBudgetsCount((int) activeBudgets)
                .goalsInProgressCount((int) goalsInProgress)
                .build();
    }

    public MonthlySummary getMonthlySummary(User user, int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end   = start.withDayOfMonth(start.lengthOfMonth());

        BigDecimal income   = transactionRepository.sumAmountByUserIdAndTypeAndDateRange(
                user.getId(), TransactionType.INCOME, start, end);
        BigDecimal expenses = transactionRepository.sumAmountByUserIdAndTypeAndDateRange(
                user.getId(), TransactionType.EXPENSE, start, end);
        BigDecimal savings  = income.subtract(expenses);

        double savingsRate = income.compareTo(BigDecimal.ZERO) > 0
                ? savings.divide(income, 4, RoundingMode.HALF_UP)
                         .multiply(BigDecimal.valueOf(100)).doubleValue()
                : 0.0;

        return MonthlySummary.builder()
                .year(year).month(month)
                .totalIncome(income)
                .totalExpenses(expenses)
                .netSavings(savings)
                .savingsRate(savingsRate)
                .build();
    }

    public List<CategoryBreakdown> getCategoryBreakdown(User user, LocalDate from, LocalDate to) {
        BigDecimal totalExpenses = transactionRepository.sumAmountByUserIdAndTypeAndDateRange(
                user.getId(), TransactionType.EXPENSE, from, to);
        return buildCategoryBreakdowns(user.getId(), from, to, totalExpenses);
    }

    public List<SpendingTrend> getSpendingTrends(User user) {
        return buildMonthlyTrends(user.getId());
    }

    private List<CategoryBreakdown> buildCategoryBreakdowns(Long userId,
                                                              LocalDate from,
                                                              LocalDate to,
                                                              BigDecimal totalExpenses) {
        List<Object[]> rows = transactionRepository.findExpenseSummaryByCategory(userId, from, to);
        List<CategoryBreakdown> result = new ArrayList<>();
        for (Object[] row : rows) {
            BigDecimal amount = (BigDecimal) row[1];
            double pct = totalExpenses.compareTo(BigDecimal.ZERO) > 0
                    ? amount.divide(totalExpenses, 4, RoundingMode.HALF_UP)
                             .multiply(BigDecimal.valueOf(100)).doubleValue()
                    : 0.0;
            result.add(CategoryBreakdown.builder()
                    .category((String) row[0])
                    .amount(amount)
                    .percentage(pct)
                    .transactionCount(((Number) row[2]).longValue())
                    .build());
        }
        return result;
    }

    private List<SpendingTrend> buildMonthlyTrends(Long userId) {
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6).withDayOfMonth(1);
        List<Object[]> rows    = transactionRepository.findMonthlyTrend(userId, sixMonthsAgo);
        List<SpendingTrend> trends = new ArrayList<>();
        for (Object[] row : rows) {
            BigDecimal income   = new BigDecimal(row[2].toString());
            BigDecimal expenses = new BigDecimal(row[3].toString());
            String period       = row[0] + "-" + String.format("%02d", ((Number) row[1]).intValue());
            trends.add(SpendingTrend.builder()
                    .period(period)
                    .income(income)
                    .expenses(expenses)
                    .savings(income.subtract(expenses))
                    .build());
        }
        return trends;
    }
}
