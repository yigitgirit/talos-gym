package com.talosgym.talos_gym.club.repository;

import com.talosgym.talos_gym.club.model.Club;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ClubSpecifications {
    public static Specification<Club> withFilters(String search, String city, String district, Boolean active) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String likePattern = "%" + search.toLowerCase() + "%";
                Predicate nameLike = cb.like(cb.lower(root.get("name")), likePattern);
                Predicate addressLike = cb.like(cb.lower(root.get("address").get("fullAddress")), likePattern);
                predicates.add(cb.or(nameLike, addressLike));
            }

            if (city != null && !city.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("address").get("city")), city.toLowerCase()));
            }

            if (district != null && !district.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("address").get("district")), district.toLowerCase()));
            }

            if (active != null) {
                predicates.add(cb.equal(root.get("active"), active));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
