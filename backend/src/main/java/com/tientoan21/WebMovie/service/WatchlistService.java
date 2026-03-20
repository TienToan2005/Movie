package com.tientoan21.WebMovie.service;

import com.tientoan21.WebMovie.dto.response.MovieResponse;
import com.tientoan21.WebMovie.entity.Movie;
import com.tientoan21.WebMovie.entity.User;
import com.tientoan21.WebMovie.enums.ErrorCode;
import com.tientoan21.WebMovie.exception.AppException;
import com.tientoan21.WebMovie.mapper.MovieMapper;
import com.tientoan21.WebMovie.repository.MovieRepository;
import com.tientoan21.WebMovie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WatchlistService {
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;

    @Transactional
    public void addToWatchlist(Long movieId){
        User user = getCurrentUser();
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        user.getFavoriteMovies().add(movie);
        userRepository.save(user);
    }

    public Page<MovieResponse> getMyWatchlist(Pageable pageable){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        return movieRepository.findAllByFavoriteUsersEmail(username,pageable)
                .map(movieMapper::toMovieResponse);
    }

    @Transactional
    public void removeFromWatchlist(Long movieId){
        User user = getCurrentUser();
        user.getFavoriteMovies().removeIf(m -> m.getId().equals(movieId));
        userRepository.save(user);
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }
}
