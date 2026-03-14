package com.financeapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    @Column(nullable = false)
    private String category;

    @NotNull
    @Positive
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal limitAmount;

    @Column(precision = 15, scale = 2)
    private BigDecimal spentAmount = BigDecimal.ZERO;

    @NotNull
    @Column(nullable = false)
    private LocalDate startDate;

    @NotNull
    @Column(nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BudgetPeriod period = BudgetPeriod.MONTHLY;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }

    // ─── Constructors ─────────────────────────────────────────────────────────
    public Budget() {}

    private Budget(Builder builder) {
        this.user        = builder.user;
        this.category    = builder.category;
        this.limitAmount = builder.limitAmount;
        this.spentAmount = builder.spentAmount != null ? builder.spentAmount : BigDecimal.ZERO;
        this.startDate   = builder.startDate;
        this.endDate     = builder.endDate;
        this.period      = builder.period != null ? builder.period : BudgetPeriod.MONTHLY;
        this.createdAt   = LocalDateTime.now();
        this.updatedAt   = LocalDateTime.now();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private User         user;
        private String       category;
        private BigDecimal   limitAmount;
        private BigDecimal   spentAmount;
        private LocalDate    startDate;
        private LocalDate    endDate;
        private BudgetPeriod period;

        public Builder user(User u)              { this.user        = u; return this; }
        public Builder category(String c)         { this.category    = c; return this; }
        public Builder limitAmount(BigDecimal a)  { this.limitAmount = a; return this; }
        public Builder spentAmount(BigDecimal a)  { this.spentAmount = a; return this; }
        public Builder startDate(LocalDate d)     { this.startDate   = d; return this; }
        public Builder endDate(LocalDate d)       { this.endDate     = d; return this; }
        public Builder period(BudgetPeriod p)     { this.period      = p; return this; }
        public Budget build()                     { return new Budget(this); }
    }

    // ─── Computed helpers ─────────────────────────────────────────────────────
    public BigDecimal getRemainingAmount() {
        return limitAmount.subtract(spentAmount);
    }

    public double getUsagePercentage() {
        if (limitAmount.compareTo(BigDecimal.ZERO) == 0) return 0.0;
        return spentAmount.divide(limitAmount, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)).doubleValue();
    }

    // ─── Getters & Setters ────────────────────────────────────────────────────
    public Long getId()                       { return id; }
    public User getUser()                     { return user; }
    public void setUser(User u)               { this.user = u; }
    public String getCategory()               { return category; }
    public void setCategory(String c)         { this.category = c; }
    public BigDecimal getLimitAmount()        { return limitAmount; }
    public void setLimitAmount(BigDecimal a)  { this.limitAmount = a; }
    public BigDecimal getSpentAmount()        { return spentAmount; }
    public void setSpentAmount(BigDecimal a)  { this.spentAmount = a; }
    public LocalDate getStartDate()           { return startDate; }
    public void setStartDate(LocalDate d)     { this.startDate = d; }
    public LocalDate getEndDate()             { return endDate; }
    public void setEndDate(LocalDate d)       { this.endDate = d; }
    public BudgetPeriod getPeriod()           { return period; }
    public void setPeriod(BudgetPeriod p)     { this.period = p; }
    public LocalDateTime getCreatedAt()       { return createdAt; }
    public LocalDateTime getUpdatedAt()       { return updatedAt; }

    public enum BudgetPeriod { WEEKLY, MONTHLY, QUARTERLY, YEARLY }
}
