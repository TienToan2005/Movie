package com.tientoan21.WebMovie.mapper;

<<<<<<< HEAD
import com.tientoan21.WebMovie.dto.reponse.MovieReponse;
import com.tientoan21.WebMovie.dto.request.MovieRequest;
import com.tientoan21.WebMovie.entity.Movie;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    MovieReponse toMovieReponse(Movie movie);
    Movie toMovieEntity(MovieRequest request);

    void updateEntity(Movie movie, MovieRequest request);
=======
public interface MovieMapper {
>>>>>>> 859c35ef2ab098ed0363490ae62a0f1f28f79d4a
}
