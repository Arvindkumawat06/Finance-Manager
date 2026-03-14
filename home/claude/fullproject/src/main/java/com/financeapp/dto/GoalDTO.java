package com.financeapp.dto;

import com.financeapp.model.Goal.GoalStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class GoalDTO {

    // ─── Request ──────────────────────────────────────────────────────────────
    public static class Request {
        @NotBlank(message = "Goal name is required")
        private String name;

        private String description;

        @NotNull(message = "Target amount is required")
        @Positive(message = "Target amount must be positive")
        private BigDecimal targetAmount;

        @Positive
        private BigDecimal savedAmount;

        @NotNull(message = "Target date is required")
        private LocalDate targetDate;

        public Request() {}
        public String getName()                  { return name; }
        public void setName(String n)             { this.name = n; }
        public String getDescription()           { return description; }
        public void setDescription(String d)     { this.description = d; }
        public BigDecimal getTargetAmount()      { return targetAmount; }
        public void setTargetAmount(BigDecimal a){ this.targetAmount = a; }
        public BigDecimal getSavedAmount()       { return savedAmount; }
        public void setSavedAmount(BigDecimal a) { this.savedAmount = a; }
        public LocalDate getTargetDate()         { return targetDate; }
        public void setTargetDate(LocalDate d)   { this.targetDate = d; }
    }

    // ─── Response ─────────────────────────────────────────────────────────────
    public static class Response {
        private Long       id;
        private String     name;
        private String     description;
        private BigDecimal targetAmount;
        private BigDecimal savedAmount;
        private BigDecimal remainingAmount;
        private double     progressPercentage;
        private LocalDate  targetDate;
        private GoalStatus status;
        private LocalDateTime createdAt;

        public Response() {}

        private Response(Builder b) {
            this.id = b.id; this.name = b.name; this.description = b.description;
            this.targetAmount = b.targetAmount; this.savedAmount = b.savedAmount;
            this.remainingAmount = b.remainingAmount; this.progressPercentage = b.progressPercentage;
            this.targetDate = b.targetDate; this.status = b.status; this.createdAt = b.createdAt;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private Long id; private String name; private String description;
            private BigDecimal targetAmount; private BigDecimal savedAmount;
            private BigDecimal remainingAmount; private double progressPercentage;
            private LocalDate targetDate; private GoalStatus status; private LocalDateTime createdAt;

            public Builder id(Long i)                    { this.id                 = i; return this; }
            public Builder name(String n)                 { this.name               = n; return this; }
            public Builder description(String d)          { this.description        = d; return this; }
            public Builder targetAmount(BigDecimal a)     { this.targetAmount       = a; return this; }
            public Builder savedAmount(BigDecimal a)      { this.savedAmount        = a; return this; }
            public Builder remainingAmount(BigDecimal a)  { this.remainingAmount    = a; return this; }
            public Builder progressPercentage(double p)   { this.progressPercentage = p; return this; }
            public Builder targetDate(LocalDate d)        { this.targetDate         = d; return this; }
            public Builder status(GoalStatus s)           { this.status             = s; return this; }
            public Builder createdAt(LocalDateTime dt)    { this.createdAt          = dt; return this; }
            public Response build()                       { return new Response(this); }
        }

        public Long getId()                  { return id; }
        public String getName()              { return name; }
        public String getDescription()       { return description; }
        public BigDecimal getTargetAmount()  { return targetAmount; }
        public BigDecimal getSavedAmount()   { return savedAmount; }
        public BigDecimal getRemainingAmount() { return remainingAmount; }
        public double getProgressPercentage(){ return progressPercentage; }
        public LocalDate getTargetDate()     { return targetDate; }
        public GoalStatus getStatus()        { return status; }
        public LocalDateTime getCreatedAt()  { return createdAt; }
    }

    // ─── Contribute Request ───────────────────────────────────────────────────
    public static class ContributeRequest {
        @NotNull @Positive
        private BigDecimal amount;

        public ContributeRequest() {}
        public BigDecimal getAmount()       { return amount; }
        public void setAmount(BigDecimal a) { this.amount = a; }
    }
}
