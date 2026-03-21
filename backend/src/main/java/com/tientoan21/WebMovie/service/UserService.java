package com.tientoan21.WebMovie.service;

import com.tientoan21.WebMovie.dto.response.UserResponse;
import com.tientoan21.WebMovie.dto.request.UserRequest;
import com.tientoan21.WebMovie.entity.User;
import com.tientoan21.WebMovie.enums.ErrorCode;
import com.tientoan21.WebMovie.enums.RoleUser;
import com.tientoan21.WebMovie.exception.AppException;
import com.tientoan21.WebMovie.mapper.UserMapper;
import com.tientoan21.WebMovie.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    public User create(String email, String username, String rawPassword) {
        if (userRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        if(userRepository.existsByUsername(username)) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setUsername(username);
        user.setRoleUser(RoleUser.CUSTOMER);
        user.setIsActive(true);

        return userRepository.save(user);
    }

    public List<UserResponse> getAllUser() {
        return userRepository.findAll().stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId().toString())
                        .email(user.getEmail())
                        .username(user.getUsername())
                        .role(user.getRoleUser().name())
                        .createdAt(user.getCreatedAt().toString())
                        .build())
                .collect(Collectors.toList());
    }

    public UserResponse getMyInfo() {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            return userRepository.findByUsername(username)
                    .or(() -> userRepository.findByEmail(username))
                    .map(userMapper::toUserResponse)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        } catch (Exception e) {
            throw e;
        }
    }
    public UserResponse update(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!user.getIsActive()) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        user.setUsername(request.username().trim());
        User saved = userRepository.save(user);

        return userMapper.toUserResponse(saved);
    }
    public void delete(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setIsActive(false);
    }

    public void changeRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!user.getIsActive()) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        user.setRoleUser(RoleUser.valueOf(role));
        userRepository.save(user);
    }
}
