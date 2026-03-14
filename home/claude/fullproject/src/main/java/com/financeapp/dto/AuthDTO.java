package com.financeapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDTO {

    // ─── Register Request ─────────────────────────────────────────────────────
    public static class RegisterRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @Email(message = "Valid email is required")
        @NotBlank(message = "Email is required")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;

        public RegisterRequest() {}
        public String getName()             { return name; }
        public void setName(String n)       { this.name = n; }
        public String getEmail()            { return email; }
        public void setEmail(String e)      { this.email = e; }
        public String getPassword()         { return password; }
        public void setPassword(String p)   { this.password = p; }
    }

    // ─── Login Request ────────────────────────────────────────────────────────
    public static class LoginRequest {
        @Email @NotBlank
        private String email;

        @NotBlank
        private String password;

        public LoginRequest() {}
        public String getEmail()            { return email; }
        public void setEmail(String e)      { this.email = e; }
        public String getPassword()         { return password; }
        public void setPassword(String p)   { this.password = p; }
    }

    // ─── Auth Response ────────────────────────────────────────────────────────
    public static class AuthResponse {
        private String token;
        private String tokenType;
        private Long   userId;
        private String name;
        private String email;

        public AuthResponse() {}

        private AuthResponse(Builder b) {
            this.token     = b.token;
            this.tokenType = b.tokenType;
            this.userId    = b.userId;
            this.name      = b.name;
            this.email     = b.email;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private String token; private String tokenType;
            private Long userId;  private String name; private String email;

            public Builder token(String t)      { this.token     = t; return this; }
            public Builder tokenType(String t)  { this.tokenType = t; return this; }
            public Builder userId(Long u)        { this.userId    = u; return this; }
            public Builder name(String n)        { this.name      = n; return this; }
            public Builder email(String e)       { this.email     = e; return this; }
            public AuthResponse build()          { return new AuthResponse(this); }
        }

        public String getToken()      { return token; }
        public String getTokenType()  { return tokenType; }
        public Long getUserId()       { return userId; }
        public String getName()       { return name; }
        public String getEmail()      { return email; }
    }
}
