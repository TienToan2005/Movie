package com.tientoan21.WebMovie.dto.request;

import com.tientoan21.WebMovie.enums.MovieStatus;
import com.tientoan21.WebMovie.enums.MovieType;

public record MovieFilter(
     String title,
     MovieStatus status,
     MovieType type,
     String country,
     Integer year,
     Long categoryId
) {
}
