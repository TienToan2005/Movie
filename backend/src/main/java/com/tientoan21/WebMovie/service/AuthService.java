package com.tientoan21.WebMovie.service;

import com.tientoan21.WebMovie.dto.request.LoginRequest;
import com.tientoan21.WebMovie.dto.request.RegisterRequest;
import com.tientoan21.WebMovie.dto.request.UserRequest;
import com.tientoan21.WebMovie.dto.response.TokenResponse;
import com.tientoan21.WebMovie.dto.response.UserResponse;
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
    private final JwtService jwtService;
    private final UserMapper userMapper;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userMapper = userMapper;
    }

    public TokenResponse login(LoginRequest request){
        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        boolean authen = passwordEncoder.matches(request.password(), user.getPasswordHash());
        if(!authen){
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }
        var token = jwtService.generateToken(user);

        return TokenResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }
    public UserResponse register(RegisterRequest request){
        if(userRepository.existsByEmail(request.email())){
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRoleUser(RoleUser.CUSTOMER);
        user.setIsActive(true);

        return userMapper.toUserResponse(userRepository.save(user));
    }
}
