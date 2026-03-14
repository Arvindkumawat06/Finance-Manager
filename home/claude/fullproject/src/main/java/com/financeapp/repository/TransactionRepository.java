package com.financeapp.repository;

import com.financeapp.model.Transaction;
import com.financeapp.model.Transaction.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Page<Transaction> findByUserIdOrderByDateDesc(Long userId, Pageable pageable);

    Page<Transaction> findByUserIdAndTypeOrderByDateDesc(Long userId, TransactionType type, Pageable pageable);

    Page<Transaction> findByUserIdAndCategoryOrderByDateDesc(Long userId, String category, Pageable pageable);

    List<Transaction> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate startDate, LocalDate endDate);

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type")
    BigDecimal sumAmountByUserIdAndType(@Param("userId") Long userId, @Param("type") TransactionType type);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type AND t.date BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByUserIdAndTypeAndDateRange(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT t.category, SUM(t.amount) as total, COUNT(t) as cnt FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = 'EXPENSE' AND t.date BETWEEN :startDate AND :endDate " +
           "GROUP BY t.category ORDER BY total DESC")
    List<Object[]> findExpenseSummaryByCategory(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId " +
           "AND t.category = :category AND t.type = 'EXPENSE' AND t.date BETWEEN :startDate AND :endDate")
    BigDecimal sumExpensesByUserAndCategoryAndDateRange(
            @Param("userId") Long userId,
            @Param("category") String category,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query(value = "SELECT YEAR(t.date) as yr, MONTH(t.date) as mo, " +
           "SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) as income, " +
           "SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END) as expenses " +
           "FROM transactions t WHERE t.user_id = :userId AND t.date >= :fromDate " +
           "GROUP BY YEAR(t.date), MONTH(t.date) ORDER BY yr DESC, mo DESC",
           nativeQuery = true)
    List<Object[]> findMonthlyTrend(@Param("userId") Long userId, @Param("fromDate") LocalDate fromDate);
}
