package com.financeapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ─── Constructors ─────────────────────────────────────────────────────────
    public User() {}

    // Builder pattern (manual)
    private User(Builder builder) {
        this.name      = builder.name;
        this.email     = builder.email;
        this.password  = builder.password;
        this.role      = builder.role != null ? builder.role : Role.USER;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String name;
        private String email;
        private String password;
        private Role   role;

        public Builder name(String name)         { this.name     = name;     return this; }
        public Builder email(String email)        { this.email    = email;    return this; }
        public Builder password(String password)  { this.password = password; return this; }
        public Builder role(Role role)            { this.role     = role;     return this; }
        public User build()                       { return new User(this); }
    }

    // ─── UserDetails ──────────────────────────────────────────────────────────
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override public String getUsername()              { return email; }
    @Override public boolean isAccountNonExpired()     { return true; }
    @Override public boolean isAccountNonLocked()      { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled()               { return true; }

    // ─── Getters & Setters ────────────────────────────────────────────────────
    public Long getId()                  { return id; }
    public String getName()              { return name; }
    public void setName(String name)     { this.name = name; }
    public String getEmail()             { return email; }
    public void setEmail(String email)   { this.email = email; }
    public String getPassword()          { return password; }
    public void setPassword(String p)    { this.password = p; }
    public Role getRole()                { return role; }
    public void setRole(Role role)       { this.role = role; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getUpdatedAt()  { return updatedAt; }

    public enum Role { USER, ADMIN }
}
