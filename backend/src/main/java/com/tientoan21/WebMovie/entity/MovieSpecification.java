package com.tientoan21.WebMovie.entity;

import com.tientoan21.WebMovie.enums.MovieStatus;
import com.tientoan21.WebMovie.enums.MovieType;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

public class MovieSpecification {
    public static Specification<Movie> hasTitle(String title){
        return ((root, query, criteriaBuilder)
                -> title == null ?
                null : criteriaBuilder.like(root.get("title"), "%" + title.toLowerCase() + "%")
                );
    }
    public static Specification<Movie> hasStatus(MovieStatus status) {
        return (root, query, cb) ->
               status  == null ? null :
                        cb.equal(root.get("status"), status);
    }
    public static Specification<Movie> hasType(MovieType type) {
        return (root, query, cb) -> {
            if (type == null) return null;
            return cb.equal(root.get("type"), type);
        };
    }
    public static Specification<Movie> hasCountry(String country) {
        return (root, query, cb) -> {
            if (country == null || country.isEmpty()) return null;
            return cb.equal(root.get("country"), country);
        };
    }
    public static Specification<Movie> hasYear(Integer year) {
        return (root, query, cb)
                -> year == null ? null : cb.equal(root.get("year"), year);
    }

    public static Specification<Movie> hasCategory(Long categoryId) {
        return (root, query, cb) -> {
            if (categoryId == null) return null;

            Subquery<Long> subquery = query.subquery(Long.class);
            Root<Movie> subRoot = subquery.from(Movie.class);
            Join<Movie, Category> subJoin = subRoot.join("categories");

            subquery.select(subRoot.get("id"))
                    .where(cb.and(
                            cb.equal(subRoot.get("id"), root.get("id")),
                            cb.equal(subJoin.get("id"), categoryId)
                    ));

            return cb.exists(subquery);
        };
    }
    public static Specification<Movie> fetchCategories() {
        return (root, query, cb) -> {

            if (Movie.class.equals(query.getResultType())) {
                root.fetch("categories", JoinType.LEFT);
                query.distinct(true);
            }

            return null;
        };
    }
}
