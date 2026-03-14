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
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    @Column(nullable = false)
    private String name;

    private String description;

    @NotNull
    @Positive
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal targetAmount;

    @Column(precision = 15, scale = 2)
    private BigDecimal savedAmount = BigDecimal.ZERO;

    @NotNull
    @Column(nullable = false)
    private LocalDate targetDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GoalStatus status = GoalStatus.IN_PROGRESS;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }

    // ─── Constructors ─────────────────────────────────────────────────────────
    public Goal() {}

    private Goal(Builder builder) {
        this.user         = builder.user;
        this.name         = builder.name;
        this.description  = builder.description;
        this.targetAmount = builder.targetAmount;
        this.savedAmount  = builder.savedAmount != null ? builder.savedAmount : BigDecimal.ZERO;
        this.targetDate   = builder.targetDate;
        this.status       = GoalStatus.IN_PROGRESS;
        this.createdAt    = LocalDateTime.now();
        this.updatedAt    = LocalDateTime.now();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private User       user;
        private String     name;
        private String     description;
        private BigDecimal targetAmount;
        private BigDecimal savedAmount;
        private LocalDate  targetDate;

        public Builder user(User u)              { this.user         = u; return this; }
        public Builder name(String n)             { this.name         = n; return this; }
        public Builder description(String d)      { this.description  = d; return this; }
        public Builder targetAmount(BigDecimal a) { this.targetAmount = a; return this; }
        public Builder savedAmount(BigDecimal a)  { this.savedAmount  = a; return this; }
        public Builder targetDate(LocalDate d)    { this.targetDate   = d; return this; }
        public Goal build()                       { return new Goal(this); }
    }

    // ─── Computed helpers ─────────────────────────────────────────────────────
    public BigDecimal getRemainingAmount() {
        return targetAmount.subtract(savedAmount);
    }

    public double getProgressPercentage() {
        if (targetAmount.compareTo(BigDecimal.ZERO) == 0) return 0.0;
        return savedAmount.divide(targetAmount, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)).doubleValue();
    }

    // ─── Getters & Setters ────────────────────────────────────────────────────
    public Long getId()                        { return id; }
    public User getUser()                      { return user; }
    public void setUser(User u)                { this.user = u; }
    public String getName()                    { return name; }
    public void setName(String n)              { this.name = n; }
    public String getDescription()             { return description; }
    public void setDescription(String d)       { this.description = d; }
    public BigDecimal getTargetAmount()        { return targetAmount; }
    public void setTargetAmount(BigDecimal a)  { this.targetAmount = a; }
    public BigDecimal getSavedAmount()         { return savedAmount; }
    public void setSavedAmount(BigDecimal a)   { this.savedAmount = a; }
    public LocalDate getTargetDate()           { return targetDate; }
    public void setTargetDate(LocalDate d)     { this.targetDate = d; }
    public GoalStatus getStatus()              { return status; }
    public void setStatus(GoalStatus s)        { this.status = s; }
    public LocalDateTime getCreatedAt()        { return createdAt; }
    public LocalDateTime getUpdatedAt()        { return updatedAt; }

    public enum GoalStatus { IN_PROGRESS, COMPLETED, CANCELLED }
}
