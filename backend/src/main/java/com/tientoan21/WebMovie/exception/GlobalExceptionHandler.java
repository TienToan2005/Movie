package com.tientoan21.WebMovie.exception;

import com.tientoan21.WebMovie.dto.reponse.ApiResponse;
import com.tientoan21.WebMovie.enums.ErrorCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Object>> handleAppException(AppException appException){
        ErrorCode errorCode = appException.getErrorCode();
        ApiError error = ApiError.builder()
                .code(errorCode.getCode())
                .message(appException.getMessage())
                .build();

        return ResponseEntity.status(Integer.parseInt(String.valueOf(errorCode.getHttpStatus())))
                .body(ApiResponse.builder()
                        .success(false)
                        .data(null)
                        .error(error)
                        .build()
                );
    }
}
