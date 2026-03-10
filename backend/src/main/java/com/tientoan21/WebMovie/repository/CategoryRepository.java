package com.tientoan21.WebMovie.repository;

import com.tientoan21.WebMovie.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category,Long> {
}
