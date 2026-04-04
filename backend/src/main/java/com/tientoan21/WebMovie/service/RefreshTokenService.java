package com.tientoan21.WebMovie.service;

import com.tientoan21.WebMovie.entity.RefreshToken;
import com.tientoan21.WebMovie.entity.User;
import com.tientoan21.WebMovie.mapper.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    private static final long REFRESH_TOKEN_EXPIRY_DAYS = 10;

    public RefreshToken createRefreshToken(User user) {

        RefreshToken token = new RefreshToken();

        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setRevoked(false);
        token.setExpiryDate(
                Instant.now().plus(REFRESH_TOKEN_EXPIRY_DAYS, ChronoUnit.DAYS)
        );

        return refreshTokenRepository.save(token);
    }

    public RefreshToken verifyToken(String token) {

        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(token)
                .orElseThrow(() ->
                        new RuntimeException("Refresh token not found")
                );

        if (refreshToken.isRevoked()) {
            throw new RuntimeException("Refresh token already revoked");
        }

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            throw new RuntimeException("Refresh token expired");
        }

        return refreshToken;
    }

    public RefreshToken rotateToken(RefreshToken oldToken) {

        // revoke token cũ
        oldToken.setRevoked(true);
        refreshTokenRepository.save(oldToken);

        // tạo refresh token mới
        RefreshToken newToken = new RefreshToken();

        newToken.setToken(UUID.randomUUID().toString());
        newToken.setUser(oldToken.getUser());
        newToken.setRevoked(false);
        newToken.setParent(oldToken);
        newToken.setExpiryDate(
                Instant.now().plus(REFRESH_TOKEN_EXPIRY_DAYS, ChronoUnit.DAYS)
        );

        return refreshTokenRepository.save(newToken);
    }
}