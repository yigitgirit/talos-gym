package com.talosgym.talos_gym.user.repository;

import com.talosgym.talos_gym.user.dto.UserSearchRequest;
import com.talosgym.talos_gym.user.model.Gender;
import com.talosgym.talos_gym.user.model.Role;
import com.talosgym.talos_gym.user.model.User;
import com.talosgym.talos_gym.user.model.UserStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

public final class UserSpecifications {

    private UserSpecifications() {
        // Utility class
    }

    public static Specification<User> withDynamicQuery(UserSearchRequest request) {
        return (root, query, cb) -> {
            List<Specification<User>> specs = Stream.of(
                    hasSearch(request.search()),
                    hasStatus(request.status()),
                    hasGender(request.gender()),
                    hasRole(request.role())
            ).filter(Objects::nonNull).toList();

            Specification<User> filterSpec = Specification.allOf(specs);

            return filterSpec.toPredicate(root, query, cb);
        };
    }

    private static Specification<User> hasSearch(String search) {
        if (!StringUtils.hasText(search)) return null;
        return (root, query, cb) -> {
            String searchPattern = "%" + search.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("firstName")), searchPattern),
                    cb.like(cb.lower(root.get("lastName")), searchPattern),
                    cb.like(cb.lower(root.get("email")), searchPattern),
                    cb.like(root.get("phoneNumber"), searchPattern)
            );
        };
    }

    private static Specification<User> hasStatus(UserStatus status) {
        if (status == null) return null;
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    private static Specification<User> hasGender(Gender gender) {
        if (gender == null) return null;
        return (root, query, cb) -> cb.equal(root.get("gender"), gender);
    }

    private static Specification<User> hasRole(Role role) {
        if (role == null) return null;
        return (root, query, cb) -> cb.isMember(role, root.get("roles"));
    }
}
