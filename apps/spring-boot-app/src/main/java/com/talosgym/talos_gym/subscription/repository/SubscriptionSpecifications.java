package com.talosgym.talos_gym.subscription.repository;

import com.talosgym.talos_gym.subscription.dto.SubscriptionFilterDto;
import com.talosgym.talos_gym.subscription.model.Subscription;
import com.talosgym.talos_gym.subscription.model.SubscriptionStatus;
import com.talosgym.talos_gym.user.model.User;
import com.talosgym.talos_gym.membership.model.MembershipPlan;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

import static com.talosgym.talos_gym.common.repository.SpecificationUtils.getOrCreateJoin;

public final class SubscriptionSpecifications {

    private SubscriptionSpecifications() {
        // Utility class
    }

    public static Specification<Subscription> withFilters(SubscriptionFilterDto filter) {
        return (root, query, cb) -> {
            List<Specification<Subscription>> specs = Stream.of(
                    hasUserId(filter.userId()),
                    hasPlanId(filter.planId()),
                    hasStatus(filter.status()),
                    hasPaymentReference(filter.paymentReference())
            ).filter(Objects::nonNull).toList();

            Specification<Subscription> filterSpec = Specification.allOf(specs);

            return filterSpec.toPredicate(root, query, cb);
        };
    }

    private static Specification<Subscription> hasUserId(Long userId) {
        if (userId == null) return null;
        return (root, query, cb) -> {
            Join<Subscription, User> user = getOrCreateJoin(root, "user", JoinType.INNER);
            return cb.equal(user.get("id"), userId);
        };
    }

    private static Specification<Subscription> hasPlanId(Long planId) {
        if (planId == null) return null;
        return (root, query, cb) -> {
            Join<Subscription, MembershipPlan> plan = getOrCreateJoin(root, "plan", JoinType.INNER);
            return cb.equal(plan.get("id"), planId);
        };
    }

    private static Specification<Subscription> hasStatus(SubscriptionStatus status) {
        if (status == null) return null;
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    private static Specification<Subscription> hasPaymentReference(String paymentReference) {
        if (!StringUtils.hasText(paymentReference)) return null;
        return (root, query, cb) -> cb.equal(root.get("paymentReference"), paymentReference);
    }
}
