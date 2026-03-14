package com.financeapp.repository;

import com.financeapp.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Budget> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.startDate <= :date AND b.endDate >= :date")
    List<Budget> findActiveBudgetsByUserAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.category = :category " +
           "AND b.startDate <= :date AND b.endDate >= :date")
    Optional<Budget> findActiveBudgetByUserAndCategory(
            @Param("userId") Long userId,
            @Param("category") String category,
            @Param("date") LocalDate date);

    long countByUserIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long userId, LocalDate end, LocalDate start);
}
