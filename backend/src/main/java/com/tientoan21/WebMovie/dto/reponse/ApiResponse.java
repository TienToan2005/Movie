package com.tientoan21.WebMovie.dto.reponse;

import com.tientoan21.WebMovie.exception.ApiError;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private ApiError error;
}


