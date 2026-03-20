package com.tientoan21.WebMovie.repository;

import com.tientoan21.WebMovie.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category,Long> {
    Optional<Category> findByName(String catName);
}
