package com.tientoan21.WebMovie.mapper;

import com.tientoan21.WebMovie.dto.response.MovieResponse;
import com.tientoan21.WebMovie.dto.request.MovieRequest;
import com.tientoan21.WebMovie.entity.Movie;
import org.mapstruct.Mapper;

import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    MovieResponse toMovieResponse(Movie movie);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categories", ignore = true)
    Movie toMovieEntity(MovieRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "streamUrl", source = "streamUrl")
    void updateEntity(@MappingTarget Movie movie, MovieRequest request);
}
