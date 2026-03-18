package com.tientoan21.WebMovie.service;

import com.tientoan21.WebMovie.dto.request.LoginRequest;
import com.tientoan21.WebMovie.dto.request.RegisterRequest;
import com.tientoan21.WebMovie.dto.response.RefreshTokenResponse;
import com.tientoan21.WebMovie.dto.response.TokenResponse;
import com.tientoan21.WebMovie.dto.response.UserResponse;
import com.tientoan21.WebMovie.entity.RefreshToken;
import com.tientoan21.WebMovie.entity.User;
import com.tientoan21.WebMovie.enums.ErrorCode;
import com.tientoan21.WebMovie.enums.RoleUser;
import com.tientoan21.WebMovie.exception.AppException;
import com.tientoan21.WebMovie.mapper.UserMapper;
import com.tientoan21.WebMovie.repository.UserRepository;
import com.tientoan21.WebMovie.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, RefreshTokenService refreshTokenService, JwtService jwtService, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenService = refreshTokenService;
        this.jwtService = jwtService;
        this.userMapper = userMapper;
    }

    public TokenResponse login(LoginRequest request) {
        var user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        boolean authen = passwordEncoder.matches(request.password(), user.getPasswordHash());
        if (!authen) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }
        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = refreshTokenService.createRefreshToken(user);
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .username(user.getUsername())
                .email(user.getEmail())
                .authenticated(true)
                .build();
    }

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRoleUser(RoleUser.CUSTOMER);
        user.setIsActive(true);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public RefreshTokenResponse refreshToken(String token) {

        RefreshToken refreshToken =
                refreshTokenService.verifyToken(token);

        RefreshToken newToken =
                refreshTokenService.rotateToken(refreshToken);

        String accessToken =
                jwtService.generateAccessToken(refreshToken.getUser());

        return RefreshTokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(newToken.getToken())
                .build();
    }
}
