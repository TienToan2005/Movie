package com.tientoan21.WebMovie.dto.response;

import com.tientoan21.WebMovie.exception.ApiError;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiResponse<T> {
    @Builder.Default
    private boolean success = true;
    private T data;
    private ApiError error;
}
