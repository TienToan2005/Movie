package com.tientoan21.WebMovie.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    VALIDATION_ERROR(1000, HttpStatus.BAD_REQUEST,"Validation failed"), //400
    USER_NOT_FOUND(1001,HttpStatus.NOT_FOUND,"User not found"),
    MOVIE_NOT_FOUND(1002,HttpStatus.NOT_FOUND,"Movie not found"),//404
    MOVIE_EXISTED(1003,HttpStatus.CONFLICT,"Movie already exists"), //409
    USER_EXISTED(1004,HttpStatus.CONFLICT,"User already exists"),
    BAD_REQUEST(1005,HttpStatus.BAD_REQUEST,"Bad request"),//400
    INTERNAL_ERROR(1006,HttpStatus.INTERNAL_SERVER_ERROR,"Internal server error"), //500
    FORBIDDEN(1007,HttpStatus.FORBIDDEN,"Access denied"), //403
    INVALID_CREDENTIALS(1008,HttpStatus.BAD_REQUEST,"Invalid credentials"),
    CATEGORY_NOT_FOUND(1009,HttpStatus.NOT_FOUND,"Category not found"),
    UNAUTHORIZED(1010,HttpStatus.UNAUTHORIZED,"You do not have access"),
    UPLOAD_FAILED(1011,HttpStatus.MULTI_STATUS,"upload failed"),
    USER_ALREADY_REVIEWED(1012,HttpStatus.BAD_REQUEST,"Users have reviewed the movie."),
    REVIEW_NOT_FOUND(1013,HttpStatus.NOT_FOUND,"Review not found"),
    UNAUTHORIZED_ACTION(1014,HttpStatus.UNAUTHORIZED,"You do not have action"),
    EMAIL_EXISTED(1015,HttpStatus.CONFLICT,"Email already exists"),
    MOVIE_ALREADY_EXISTS(1016,HttpStatus.BAD_REQUEST ,"This movie already exists in Database." );

    private final int code;
    private final HttpStatus httpStatus;
    private final String message;

    ErrorCode(int code, HttpStatus httpStatus, String message) {
        this.code = code;
        this.httpStatus = httpStatus;
        this.message = message;
    }

}
