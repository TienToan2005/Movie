package com.tientoan21.WebMovie.controller;

import com.tientoan21.WebMovie.dto.request.RegisterRequest;
import com.tientoan21.WebMovie.dto.request.UserRequest;
import com.tientoan21.WebMovie.dto.response.ApiResponse;
import com.tientoan21.WebMovie.dto.response.UserResponse;
import com.tientoan21.WebMovie.entity.User;
import com.tientoan21.WebMovie.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<?> create(@RequestBody RegisterRequest request){
        User user = userService.create(request.email(), request.fullName(), request.password());
        return ApiResponse.<User>builder()
                .data(user)
                .build();
    }
    @GetMapping("/my-info")
    public ApiResponse<UserResponse> getMyInfo(){
        return ApiResponse.<UserResponse>builder()
                .data(userService.getMyInfo())
                .build();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<UserResponse> update(Long id , UserRequest request){
        var user = userService.update(id, request);

        return ApiResponse.<UserResponse>builder()
                .data(user)
                .build();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping
    public ResponseEntity<?> delete(Long id){
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
