package com.tientoan21.WebMovie.exception;

import com.tientoan21.WebMovie.dto.reponse.ApiResponse;
import com.tientoan21.WebMovie.enums.ErrorCode;
import org.springframework.http.ResponseEntity;
<<<<<<< HEAD
import org.springframework.web.bind.MethodArgumentNotValidException;
=======
>>>>>>> 859c35ef2ab098ed0363490ae62a0f1f28f79d4a
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
<<<<<<< HEAD

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Object>> handleAppException(AppException ex) {
        ErrorCode ec = ex.getErrorCode();

        ApiError error = ApiError.builder()
                .code(ec.getCode())
                .message(ex.getMessage())
                .build();

        return ResponseEntity.status(ec.getHttpStatus())
                .body(ApiResponse.<Object>builder()
                        .success(false)
                        .data(null)
                        .error(error)
                        .build());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");

        ApiError error = ApiError.builder()
                .code(ErrorCode.VALIDATION_ERROR.getCode())
                .message(msg)
                .build();

        return ResponseEntity.status(ErrorCode.VALIDATION_ERROR.getHttpStatus())
                .body(ApiResponse.<Object>builder()
                        .success(false)
                        .data(null)
                        .error(error)
                        .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleUnknown(Exception ex) {
        ApiError error = ApiError.builder()
                .code(ErrorCode.INTERNAL_ERROR.getCode())
                .message(ErrorCode.INTERNAL_ERROR.getMessage())
                .build();

        return ResponseEntity.status(ErrorCode.INTERNAL_ERROR.getHttpStatus())
                .body(ApiResponse.<Object>builder()
                        .success(false)
                        .data(null)
                        .error(error)
                        .build());
    }
}
=======
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
>>>>>>> 859c35ef2ab098ed0363490ae62a0f1f28f79d4a
