package com.financeapp.dto;

import com.financeapp.model.Budget.BudgetPeriod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BudgetDTO {

    // ─── Request ──────────────────────────────────────────────────────────────
    public static class Request {
        @NotBlank(message = "Category is required")
        private String category;

        @NotNull(message = "Limit amount is required")
        @Positive(message = "Limit must be positive")
        private BigDecimal limitAmount;

        @NotNull(message = "Start date is required")
        private LocalDate startDate;

        @NotNull(message = "End date is required")
        private LocalDate endDate;

        @NotNull(message = "Period is required")
        private BudgetPeriod period;

        public Request() {}
        public String getCategory()            { return category; }
        public void setCategory(String c)      { this.category = c; }
        public BigDecimal getLimitAmount()     { return limitAmount; }
        public void setLimitAmount(BigDecimal a){ this.limitAmount = a; }
        public LocalDate getStartDate()        { return startDate; }
        public void setStartDate(LocalDate d)  { this.startDate = d; }
        public LocalDate getEndDate()          { return endDate; }
        public void setEndDate(LocalDate d)    { this.endDate = d; }
        public BudgetPeriod getPeriod()        { return period; }
        public void setPeriod(BudgetPeriod p)  { this.period = p; }
    }

    // ─── Response ─────────────────────────────────────────────────────────────
    public static class Response {
        private Long         id;
        private String       category;
        private BigDecimal   limitAmount;
        private BigDecimal   spentAmount;
        private BigDecimal   remainingAmount;
        private double       usagePercentage;
        private LocalDate    startDate;
        private LocalDate    endDate;
        private BudgetPeriod period;
        private LocalDateTime createdAt;

        public Response() {}

        private Response(Builder b) {
            this.id = b.id; this.category = b.category; this.limitAmount = b.limitAmount;
            this.spentAmount = b.spentAmount; this.remainingAmount = b.remainingAmount;
            this.usagePercentage = b.usagePercentage; this.startDate = b.startDate;
            this.endDate = b.endDate; this.period = b.period; this.createdAt = b.createdAt;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private Long id; private String category; private BigDecimal limitAmount;
            private BigDecimal spentAmount; private BigDecimal remainingAmount;
            private double usagePercentage; private LocalDate startDate;
            private LocalDate endDate; private BudgetPeriod period; private LocalDateTime createdAt;

            public Builder id(Long i)                   { this.id              = i; return this; }
            public Builder category(String c)            { this.category        = c; return this; }
            public Builder limitAmount(BigDecimal a)     { this.limitAmount     = a; return this; }
            public Builder spentAmount(BigDecimal a)     { this.spentAmount     = a; return this; }
            public Builder remainingAmount(BigDecimal a) { this.remainingAmount = a; return this; }
            public Builder usagePercentage(double p)     { this.usagePercentage = p; return this; }
            public Builder startDate(LocalDate d)        { this.startDate       = d; return this; }
            public Builder endDate(LocalDate d)          { this.endDate         = d; return this; }
            public Builder period(BudgetPeriod p)        { this.period          = p; return this; }
            public Builder createdAt(LocalDateTime dt)   { this.createdAt       = dt; return this; }
            public Response build()                      { return new Response(this); }
        }

        public Long getId()                 { return id; }
        public String getCategory()         { return category; }
        public BigDecimal getLimitAmount()  { return limitAmount; }
        public BigDecimal getSpentAmount()  { return spentAmount; }
        public BigDecimal getRemainingAmount() { return remainingAmount; }
        public double getUsagePercentage()  { return usagePercentage; }
        public LocalDate getStartDate()     { return startDate; }
        public LocalDate getEndDate()       { return endDate; }
        public BudgetPeriod getPeriod()     { return period; }
        public LocalDateTime getCreatedAt() { return createdAt; }
    }
}
