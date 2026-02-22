package com.tientoan21.WebMovie.exception;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiError {
    private int code;
    private String message;
}
