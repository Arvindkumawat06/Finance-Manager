package com.financeapp.dto;

import com.financeapp.model.Transaction.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TransactionDTO {

    // ─── Request ──────────────────────────────────────────────────────────────
    public static class Request {
        @NotNull(message = "Amount is required")
        @Positive(message = "Amount must be positive")
        private BigDecimal amount;

        @NotBlank(message = "Description is required")
        private String description;

        @NotBlank(message = "Category is required")
        private String category;

        @NotNull(message = "Transaction type is required")
        private TransactionType type;

        @NotNull(message = "Date is required")
        private LocalDate date;

        private String notes;

        public Request() {}
        public BigDecimal getAmount()            { return amount; }
        public void setAmount(BigDecimal a)       { this.amount = a; }
        public String getDescription()           { return description; }
        public void setDescription(String d)     { this.description = d; }
        public String getCategory()              { return category; }
        public void setCategory(String c)        { this.category = c; }
        public TransactionType getType()         { return type; }
        public void setType(TransactionType t)   { this.type = t; }
        public LocalDate getDate()               { return date; }
        public void setDate(LocalDate d)         { this.date = d; }
        public String getNotes()                 { return notes; }
        public void setNotes(String n)           { this.notes = n; }
    }

    // ─── Response ─────────────────────────────────────────────────────────────
    public static class Response {
        private Long            id;
        private BigDecimal      amount;
        private String          description;
        private String          category;
        private TransactionType type;
        private LocalDate       date;
        private String          notes;
        private LocalDateTime   createdAt;
        private LocalDateTime   updatedAt;

        public Response() {}

        private Response(Builder b) {
            this.id = b.id; this.amount = b.amount; this.description = b.description;
            this.category = b.category; this.type = b.type; this.date = b.date;
            this.notes = b.notes; this.createdAt = b.createdAt; this.updatedAt = b.updatedAt;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private Long id; private BigDecimal amount; private String description;
            private String category; private TransactionType type; private LocalDate date;
            private String notes; private LocalDateTime createdAt; private LocalDateTime updatedAt;

            public Builder id(Long i)                  { this.id          = i; return this; }
            public Builder amount(BigDecimal a)         { this.amount      = a; return this; }
            public Builder description(String d)        { this.description = d; return this; }
            public Builder category(String c)           { this.category    = c; return this; }
            public Builder type(TransactionType t)      { this.type        = t; return this; }
            public Builder date(LocalDate d)            { this.date        = d; return this; }
            public Builder notes(String n)              { this.notes       = n; return this; }
            public Builder createdAt(LocalDateTime dt)  { this.createdAt   = dt; return this; }
            public Builder updatedAt(LocalDateTime dt)  { this.updatedAt   = dt; return this; }
            public Response build()                     { return new Response(this); }
        }

        public Long getId()              { return id; }
        public BigDecimal getAmount()    { return amount; }
        public String getDescription()   { return description; }
        public String getCategory()      { return category; }
        public TransactionType getType() { return type; }
        public LocalDate getDate()       { return date; }
        public String getNotes()         { return notes; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
    }

    // ─── Summary ──────────────────────────────────────────────────────────────
    public static class Summary {
        private BigDecimal totalIncome;
        private BigDecimal totalExpenses;
        private BigDecimal netBalance;
        private long       transactionCount;

        public Summary() {}

        private Summary(Builder b) {
            this.totalIncome = b.totalIncome; this.totalExpenses = b.totalExpenses;
            this.netBalance = b.netBalance; this.transactionCount = b.transactionCount;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private BigDecimal totalIncome; private BigDecimal totalExpenses;
            private BigDecimal netBalance;  private long transactionCount;

            public Builder totalIncome(BigDecimal a)     { this.totalIncome      = a; return this; }
            public Builder totalExpenses(BigDecimal a)   { this.totalExpenses    = a; return this; }
            public Builder netBalance(BigDecimal a)      { this.netBalance       = a; return this; }
            public Builder transactionCount(long c)      { this.transactionCount = c; return this; }
            public Summary build()                       { return new Summary(this); }
        }

        public BigDecimal getTotalIncome()   { return totalIncome; }
        public BigDecimal getTotalExpenses() { return totalExpenses; }
        public BigDecimal getNetBalance()    { return netBalance; }
        public long getTransactionCount()    { return transactionCount; }
    }
}
