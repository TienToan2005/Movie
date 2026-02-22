package com.tientoan21.WebMovie.dto.reponse;

<<<<<<< HEAD
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


=======
import lombok.Builder;

@Builder
public record ApiReponse<T, result>(
        int code,
        String messege
        T result
) {
}
>>>>>>> 859c35ef2ab098ed0363490ae62a0f1f28f79d4a
