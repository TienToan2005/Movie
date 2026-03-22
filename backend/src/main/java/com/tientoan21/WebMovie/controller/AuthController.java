package com.tientoan21.WebMovie.controller;

import com.tientoan21.WebMovie.dto.request.*;
import com.tientoan21.WebMovie.dto.response.ApiResponse;
import com.tientoan21.WebMovie.dto.response.RefreshTokenResponse;
import com.tientoan21.WebMovie.dto.response.TokenResponse;
import com.tientoan21.WebMovie.dto.response.UserResponse;
import com.tientoan21.WebMovie.entity.User;
import com.tientoan21.WebMovie.enums.UserStatus;
import com.tientoan21.WebMovie.repository.UserRepository;
import com.tientoan21.WebMovie.service.AuthService;
import com.tientoan21.WebMovie.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;
    private final OtpService otpService;
    @PostMapping("/login")
    public ApiResponse<TokenResponse> login(@RequestBody LoginRequest request){
        var token = authService.login(request);
        return ApiResponse.<TokenResponse>builder()
                .data(token)
                .build();
    }

    @PostMapping("/verify-account")
    public ApiResponse<String> verifyAccount(@RequestBody VerifyOtpRequest request) {
        if (!otpService.validateOtp(request.email(), request.otp())) {
            throw new RuntimeException("Mã OTP sai hoặc hết hạn!");
        }

        User user = userRepository.findByEmail(request.email()).get();
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);

        otpService.deleteOtp(request.email());

        return ApiResponse.<String>builder().data("Xác thực tài khoản thành công!").build();
    }
    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@Valid @RequestBody RegisterRequest request){
        UserResponse user = authService.register(request);
        return ApiResponse.<UserResponse>builder()
                .data(user)
                .build();
    }
    @PostMapping("/refresh")
    public ApiResponse<RefreshTokenResponse> refresh(@RequestBody RefreshTokenRequest request) {
        return ApiResponse.<RefreshTokenResponse>builder()
                .data(authService.refreshToken(request.refreshToken()))
                .build();
    }

    @PostMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        authService.requestForgotPassword(email);
        return ApiResponse.<String>builder()
                .data("Mã OTP đã được gửi vào Email của bạn!")
                .build();
    }
    @PostMapping("/verify-otp")
    public ApiResponse<String> verifyOtp(@RequestBody VerifyOtpRequest request) {
        boolean isValid = authService.verifyOtp(request.email(), request.otp());
        if (isValid) {
            return ApiResponse.<String>builder()
                    .data("Mã OTP chính xác!")
                    .build();
        }
        throw new RuntimeException("Mã OTP không hợp lệ hoặc đã hết hạn!");
    }

    @PostMapping("/reset-password")
    public ApiResponse<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.email(), request.otp(), request.newPassword());
        return ApiResponse.<String>builder()
                .data("Mật khẩu đã được đặt lại thành công!")
                .build();
    }
}
