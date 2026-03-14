package com.financeapp.service;

import com.financeapp.dto.GoalDTO.ContributeRequest;
import com.financeapp.dto.GoalDTO.Request;
import com.financeapp.dto.GoalDTO.Response;
import com.financeapp.model.Goal;
import com.financeapp.model.Goal.GoalStatus;
import com.financeapp.model.User;
import com.financeapp.repository.GoalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GoalService {

    private final GoalRepository goalRepository;

    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    public List<Response> getGoals(User user) {
        return goalRepository.findByUserIdOrderByTargetDateAsc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<Response> getGoalsByStatus(User user, GoalStatus status) {
        return goalRepository.findByUserIdAndStatusOrderByTargetDateAsc(user.getId(), status)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Response getGoal(User user, Long id) {
        return goalRepository.findByIdAndUserId(id, user.getId())
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + id));
    }

    @Transactional
    public Response createGoal(User user, Request request) {
        Goal goal = Goal.builder()
                .user(user)
                .name(request.getName())
                .description(request.getDescription())
                .targetAmount(request.getTargetAmount())
                .savedAmount(request.getSavedAmount() != null ? request.getSavedAmount() : BigDecimal.ZERO)
                .targetDate(request.getTargetDate())
                .build();
        checkCompletion(goal);
        return toResponse(goalRepository.save(goal));
    }

    @Transactional
    public Response updateGoal(User user, Long id, Request request) {
        Goal goal = goalRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + id));

        goal.setName(request.getName());
        goal.setDescription(request.getDescription());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setTargetDate(request.getTargetDate());
        if (request.getSavedAmount() != null) {
            goal.setSavedAmount(request.getSavedAmount());
        }
        checkCompletion(goal);
        return toResponse(goalRepository.save(goal));
    }

    @Transactional
    public Response contribute(User user, Long id, ContributeRequest request) {
        Goal goal = goalRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + id));

        if (goal.getStatus() == GoalStatus.COMPLETED) {
            throw new IllegalStateException("Cannot contribute to a completed goal");
        }
        if (goal.getStatus() == GoalStatus.CANCELLED) {
            throw new IllegalStateException("Cannot contribute to a cancelled goal");
        }
        goal.setSavedAmount(goal.getSavedAmount().add(request.getAmount()));
        checkCompletion(goal);
        return toResponse(goalRepository.save(goal));
    }

    @Transactional
    public Response updateStatus(User user, Long id, GoalStatus status) {
        Goal goal = goalRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + id));
        goal.setStatus(status);
        return toResponse(goalRepository.save(goal));
    }

    @Transactional
    public void deleteGoal(User user, Long id) {
        Goal goal = goalRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + id));
        goalRepository.delete(goal);
    }

    private void checkCompletion(Goal goal) {
        if (goal.getSavedAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus(GoalStatus.COMPLETED);
        }
    }

    private Response toResponse(Goal g) {
        return Response.builder()
                .id(g.getId())
                .name(g.getName())
                .description(g.getDescription())
                .targetAmount(g.getTargetAmount())
                .savedAmount(g.getSavedAmount())
                .remainingAmount(g.getRemainingAmount())
                .progressPercentage(g.getProgressPercentage())
                .targetDate(g.getTargetDate())
                .status(g.getStatus())
                .createdAt(g.getCreatedAt())
                .build();
    }
}
