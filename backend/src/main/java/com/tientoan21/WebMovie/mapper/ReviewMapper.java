package com.tientoan21.WebMovie.mapper;

import com.tientoan21.WebMovie.dto.response.ReviewResponse;
import com.tientoan21.WebMovie.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    @Mapping(source = "user.username", target = "username")
    ReviewResponse toReviewResponse(Review review);
}
