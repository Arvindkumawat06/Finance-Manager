package com.financeapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @Positive
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @NotBlank
    @Column(nullable = false)
    private String description;

    @NotBlank
    @Column(nullable = false)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @NotNull
    @Column(nullable = false)
    private LocalDate date;

    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }

    // ─── Constructors ─────────────────────────────────────────────────────────
    public Transaction() {}

    private Transaction(Builder builder) {
        this.user        = builder.user;
        this.amount      = builder.amount;
        this.description = builder.description;
        this.category    = builder.category;
        this.type        = builder.type;
        this.date        = builder.date;
        this.notes       = builder.notes;
        this.createdAt   = LocalDateTime.now();
        this.updatedAt   = LocalDateTime.now();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private User            user;
        private BigDecimal      amount;
        private String          description;
        private String          category;
        private TransactionType type;
        private LocalDate       date;
        private String          notes;

        public Builder user(User u)              { this.user        = u;  return this; }
        public Builder amount(BigDecimal a)       { this.amount      = a;  return this; }
        public Builder description(String d)      { this.description = d;  return this; }
        public Builder category(String c)         { this.category    = c;  return this; }
        public Builder type(TransactionType t)    { this.type        = t;  return this; }
        public Builder date(LocalDate d)          { this.date        = d;  return this; }
        public Builder notes(String n)            { this.notes       = n;  return this; }
        public Transaction build()                { return new Transaction(this); }
    }

    // ─── Getters & Setters ────────────────────────────────────────────────────
    public Long getId()                      { return id; }
    public User getUser()                    { return user; }
    public void setUser(User u)              { this.user = u; }
    public BigDecimal getAmount()            { return amount; }
    public void setAmount(BigDecimal a)      { this.amount = a; }
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
    public LocalDateTime getCreatedAt()      { return createdAt; }
    public LocalDateTime getUpdatedAt()      { return updatedAt; }
    public void setUpdatedAt(LocalDateTime u){ this.updatedAt = u; }

    public enum TransactionType { INCOME, EXPENSE, TRANSFER }
}
