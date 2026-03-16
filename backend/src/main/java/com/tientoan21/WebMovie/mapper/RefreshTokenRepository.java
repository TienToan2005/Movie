package com.tientoan21.WebMovie.mapper;

import com.tientoan21.WebMovie.entity.RefreshToken;
import com.tientoan21.WebMovie.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    void deleteByUser(User user);
}
