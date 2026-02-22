package com.tientoan21.WebMovie.repository;

<<<<<<< HEAD
import com.tientoan21.WebMovie.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsById(Long id);

    Optional<User> findById(Long id);
=======
public interface UserRepository {
>>>>>>> 859c35ef2ab098ed0363490ae62a0f1f28f79d4a
}
