package com.tientoan21.WebMovie.dto.reponse;

import lombok.Builder;

@Builder
public record ApiReponse<T, result>(
        int code,
        String messege
        T result
) {
}
