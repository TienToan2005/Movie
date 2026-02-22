package com.tientoan21.WebMovie.dto.reponse;

import java.util.List;

public record PageResponse<T>(
        List<T> items,
        int page,
        int size,
        long totalItems,
        int totalPages
) { }