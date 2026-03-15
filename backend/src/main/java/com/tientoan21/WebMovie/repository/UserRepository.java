package com.tientoan21.WebMovie.repository;

import com.tientoan21.WebMovie.dto.response.DashboardResponse;
import com.tientoan21.WebMovie.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.lang.ScopedValue;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsById(Long id);

    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);

    @Query("""
       select MONTH(u.createdAt) as month,
              count(u) as count
       from User u
       group by MONTH(u.createdAt)
       """)
    List<DashboardResponse.MonthlyUserGrowth> getUserGrowth();
}
