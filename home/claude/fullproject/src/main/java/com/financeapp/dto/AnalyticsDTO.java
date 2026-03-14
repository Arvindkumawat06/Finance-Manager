package com.financeapp.dto;

import java.math.BigDecimal;
import java.util.List;

public class AnalyticsDTO {

    public static class MonthlySummary {
        private int year; private int month;
        private BigDecimal totalIncome; private BigDecimal totalExpenses;
        private BigDecimal netSavings;  private double savingsRate;

        public MonthlySummary() {}
        private MonthlySummary(Builder b) {
            this.year = b.year; this.month = b.month; this.totalIncome = b.totalIncome;
            this.totalExpenses = b.totalExpenses; this.netSavings = b.netSavings;
            this.savingsRate = b.savingsRate;
        }
        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private int year; private int month; private BigDecimal totalIncome;
            private BigDecimal totalExpenses; private BigDecimal netSavings; private double savingsRate;
            public Builder year(int y)               { this.year          = y; return this; }
            public Builder month(int m)              { this.month         = m; return this; }
            public Builder totalIncome(BigDecimal a)  { this.totalIncome  = a; return this; }
            public Builder totalExpenses(BigDecimal a){ this.totalExpenses = a; return this; }
            public Builder netSavings(BigDecimal a)   { this.netSavings   = a; return this; }
            public Builder savingsRate(double r)      { this.savingsRate  = r; return this; }
            public MonthlySummary build()             { return new MonthlySummary(this); }
        }
        public int getYear()                  { return year; }
        public int getMonth()                 { return month; }
        public BigDecimal getTotalIncome()    { return totalIncome; }
        public BigDecimal getTotalExpenses()  { return totalExpenses; }
        public BigDecimal getNetSavings()     { return netSavings; }
        public double getSavingsRate()        { return savingsRate; }
    }

    public static class CategoryBreakdown {
        private String category; private BigDecimal amount;
        private double percentage; private long transactionCount;

        public CategoryBreakdown() {}
        private CategoryBreakdown(Builder b) {
            this.category = b.category; this.amount = b.amount;
            this.percentage = b.percentage; this.transactionCount = b.transactionCount;
        }
        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private String category; private BigDecimal amount;
            private double percentage; private long transactionCount;
            public Builder category(String c)         { this.category         = c; return this; }
            public Builder amount(BigDecimal a)        { this.amount           = a; return this; }
            public Builder percentage(double p)        { this.percentage       = p; return this; }
            public Builder transactionCount(long c)    { this.transactionCount = c; return this; }
            public CategoryBreakdown build()           { return new CategoryBreakdown(this); }
        }
        public String getCategory()         { return category; }
        public BigDecimal getAmount()       { return amount; }
        public double getPercentage()       { return percentage; }
        public long getTransactionCount()   { return transactionCount; }
    }

    public static class SpendingTrend {
        private String period; private BigDecimal income;
        private BigDecimal expenses; private BigDecimal savings;

        public SpendingTrend() {}
        private SpendingTrend(Builder b) {
            this.period = b.period; this.income = b.income;
            this.expenses = b.expenses; this.savings = b.savings;
        }
        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private String period; private BigDecimal income;
            private BigDecimal expenses; private BigDecimal savings;
            public Builder period(String p)      { this.period   = p; return this; }
            public Builder income(BigDecimal a)   { this.income   = a; return this; }
            public Builder expenses(BigDecimal a) { this.expenses = a; return this; }
            public Builder savings(BigDecimal a)  { this.savings  = a; return this; }
            public SpendingTrend build()          { return new SpendingTrend(this); }
        }
        public String getPeriod()         { return period; }
        public BigDecimal getIncome()     { return income; }
        public BigDecimal getExpenses()   { return expenses; }
        public BigDecimal getSavings()    { return savings; }
    }

    public static class OverviewReport {
        private BigDecimal totalBalance; private BigDecimal monthlyIncome;
        private BigDecimal monthlyExpenses; private BigDecimal monthlySavings;
        private List<CategoryBreakdown> topExpenseCategories;
        private List<SpendingTrend> last6MonthsTrend;
        private int activeBudgetsCount; private int goalsInProgressCount;

        public OverviewReport() {}
        private OverviewReport(Builder b) {
            this.totalBalance = b.totalBalance; this.monthlyIncome = b.monthlyIncome;
            this.monthlyExpenses = b.monthlyExpenses; this.monthlySavings = b.monthlySavings;
            this.topExpenseCategories = b.topExpenseCategories;
            this.last6MonthsTrend = b.last6MonthsTrend;
            this.activeBudgetsCount = b.activeBudgetsCount;
            this.goalsInProgressCount = b.goalsInProgressCount;
        }
        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private BigDecimal totalBalance; private BigDecimal monthlyIncome;
            private BigDecimal monthlyExpenses; private BigDecimal monthlySavings;
            private List<CategoryBreakdown> topExpenseCategories;
            private List<SpendingTrend> last6MonthsTrend;
            private int activeBudgetsCount; private int goalsInProgressCount;

            public Builder totalBalance(BigDecimal a)                          { this.totalBalance          = a; return this; }
            public Builder monthlyIncome(BigDecimal a)                         { this.monthlyIncome         = a; return this; }
            public Builder monthlyExpenses(BigDecimal a)                       { this.monthlyExpenses       = a; return this; }
            public Builder monthlySavings(BigDecimal a)                        { this.monthlySavings        = a; return this; }
            public Builder topExpenseCategories(List<CategoryBreakdown> l)     { this.topExpenseCategories  = l; return this; }
            public Builder last6MonthsTrend(List<SpendingTrend> l)             { this.last6MonthsTrend      = l; return this; }
            public Builder activeBudgetsCount(int c)                           { this.activeBudgetsCount    = c; return this; }
            public Builder goalsInProgressCount(int c)                         { this.goalsInProgressCount  = c; return this; }
            public OverviewReport build()                                       { return new OverviewReport(this); }
        }
        public BigDecimal getTotalBalance()                     { return totalBalance; }
        public BigDecimal getMonthlyIncome()                    { return monthlyIncome; }
        public BigDecimal getMonthlyExpenses()                  { return monthlyExpenses; }
        public BigDecimal getMonthlySavings()                   { return monthlySavings; }
        public List<CategoryBreakdown> getTopExpenseCategories(){ return topExpenseCategories; }
        public List<SpendingTrend> getLast6MonthsTrend()        { return last6MonthsTrend; }
        public int getActiveBudgetsCount()                      { return activeBudgetsCount; }
        public int getGoalsInProgressCount()                    { return goalsInProgressCount; }
    }
}
