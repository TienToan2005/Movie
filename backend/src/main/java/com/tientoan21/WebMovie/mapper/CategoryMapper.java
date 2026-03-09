package com.tientoan21.WebMovie.mapper;

import com.tientoan21.WebMovie.dto.request.CategoryRequest;
import com.tientoan21.WebMovie.dto.response.CategoryResponse;
import com.tientoan21.WebMovie.entity.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toCategoryResponse(Category category);
    Category toCategoryEntity(CategoryRequest request);
}