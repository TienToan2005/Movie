package com.tientoan21.WebMovie.service;

import com.tientoan21.WebMovie.dto.reponse.UserReponse;
import com.tientoan21.WebMovie.dto.request.UserRequest;
import com.tientoan21.WebMovie.entity.User;
import com.tientoan21.WebMovie.enums.ErrorCode;
import com.tientoan21.WebMovie.enums.RoleUser;
import com.tientoan21.WebMovie.exception.AppException;
import com.tientoan21.WebMovie.mapper.UserMapper;
import com.tientoan21.WebMovie.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    public User create(String email , String fullName, String rawPassword){
        if(userRepository.existsByEmail(email)){
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setFullName(fullName);
        user.setRoleUser(RoleUser.CUSTOMER);
        user.setIsActive(true);

        return userRepository.save(user);
    }
    public List<UserReponse> getAllUser(){
        return userRepository.findAll().stream()
                .map(userMapper::toUserReponse)
                .collect(java.util.stream.Collectors.toList());
    }
    public UserReponse update(Long id , UserRequest request){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if(!user.getIsActive()){

        }
        user.setFullName(request.fullName().trim());
        User saved = userRepository.save(user);

        return userMapper.toUserReponse(saved);
    }

}
