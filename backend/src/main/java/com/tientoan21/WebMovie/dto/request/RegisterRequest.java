package com.tientoan21.WebMovie.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Username không được để trống")
        String username,

        @Email(message = "Email không hợp lệ")
        String email,

        @Size(min = 8, message = "Mật khẩu phải từ 8 ký tự trở lên")
        String password
) {}
