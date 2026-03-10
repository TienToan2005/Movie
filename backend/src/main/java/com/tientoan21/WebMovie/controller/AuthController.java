package com.tientoan21.WebMovie.controller;

import com.tientoan21.WebMovie.dto.request.LoginRequest;
import com.tientoan21.WebMovie.dto.request.RegisterRequest;
import com.tientoan21.WebMovie.dto.request.UserRequest;
import com.tientoan21.WebMovie.dto.response.ApiResponse;
import com.tientoan21.WebMovie.dto.response.TokenResponse;
import com.tientoan21.WebMovie.dto.response.UserResponse;
import com.tientoan21.WebMovie.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    @PostMapping("/login")
    public ApiResponse<TokenResponse> login(@RequestBody LoginRequest request){
        var token = authService.login(request);
        return ApiResponse.<TokenResponse>builder()
                .data(token)
                .success(true)
                .error(null)
                .build();
    }
    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@RequestBody RegisterRequest request){
        UserResponse user = authService.register(request);
        return ApiResponse.<UserResponse>builder()
                .data(user)
                .success(true)
                .error(null)
                .build();
    }

}
