package com.tientoan21.WebMovie.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tientoan21.WebMovie.exception.ApiError;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    @Builder.Default
    private boolean success = true;
    private T data;
    private ApiError error;
}
