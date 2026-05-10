package com.talosgym.talos_gym.club.repository;

import com.talosgym.talos_gym.club.model.Club;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

public final class ClubSpecifications {

    private ClubSpecifications() {
        // Utility class
    }

    public static Specification<Club> withFilters(String search, String city, String district, Boolean active) {
        return (root, query, cb) -> {
            List<Specification<Club>> specs = Stream.of(
                    hasSearch(search),
                    hasCity(city),
                    hasDistrict(district),
                    isActive(active)
            ).filter(Objects::nonNull).toList();

            Specification<Club> filterSpec = Specification.allOf(specs);

            return filterSpec.toPredicate(root, query, cb);
        };
    }

    private static Specification<Club> hasSearch(String search) {
        if (!StringUtils.hasText(search)) return null;
        return (root, query, cb) -> {
            String likePattern = "%" + search.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), likePattern),
                    cb.like(cb.lower(root.get("address").get("fullAddress")), likePattern)
            );
        };
    }

    private static Specification<Club> hasCity(String city) {
        if (!StringUtils.hasText(city)) return null;
        return (root, query, cb) -> cb.equal(cb.lower(root.get("address").get("city")), city.toLowerCase());
    }

    private static Specification<Club> hasDistrict(String district) {
        if (!StringUtils.hasText(district)) return null;
        return (root, query, cb) -> cb.equal(cb.lower(root.get("address").get("district")), district.toLowerCase());
    }

    private static Specification<Club> isActive(Boolean active) {
        if (active == null) return null;
        return (root, query, cb) -> cb.equal(root.get("active"), active);
    }
}
