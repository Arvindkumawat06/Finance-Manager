package com.financeapp.controller;

import com.financeapp.dto.AnalyticsDTO.CategoryBreakdown;
import com.financeapp.dto.AnalyticsDTO.MonthlySummary;
import com.financeapp.dto.AnalyticsDTO.OverviewReport;
import com.financeapp.dto.AnalyticsDTO.SpendingTrend;
import com.financeapp.model.User;
import com.financeapp.service.AnalyticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/overview")
    public ResponseEntity<OverviewReport> getOverview(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(analyticsService.getOverview(user));
    }

    @GetMapping("/monthly")
    public ResponseEntity<MonthlySummary> getMonthlySummary(
            @AuthenticationPrincipal User user,
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(analyticsService.getMonthlySummary(user, year, month));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryBreakdown>> getCategoryBreakdown(
            @AuthenticationPrincipal User user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(analyticsService.getCategoryBreakdown(user, from, to));
    }

    @GetMapping("/trends")
    public ResponseEntity<List<SpendingTrend>> getSpendingTrends(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(analyticsService.getSpendingTrends(user));
    }
}
