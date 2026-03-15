package com.tientoan21.WebMovie.service;

import com.tientoan21.WebMovie.dto.request.ReviewMovieRequest;
import com.tientoan21.WebMovie.dto.request.ReviewRequest;
import com.tientoan21.WebMovie.dto.response.ReviewResponse;
import com.tientoan21.WebMovie.entity.Movie;
import com.tientoan21.WebMovie.entity.Review;
import com.tientoan21.WebMovie.entity.User;
import com.tientoan21.WebMovie.enums.ErrorCode;
import com.tientoan21.WebMovie.exception.AppException;
import com.tientoan21.WebMovie.mapper.ReviewMapper;
import com.tientoan21.WebMovie.repository.MovieRepository;
import com.tientoan21.WebMovie.repository.ReviewRepository;
import com.tientoan21.WebMovie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final ReviewMapper reviewMapper;
    private final ReviewRepository reviewRepository;

    @Transactional
    public ReviewResponse createReview(ReviewMovieRequest request){

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Movie movie = movieRepository.findById(request.id())
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));


        if(reviewRepository.existsByUserIdAndMovieId(movie.getId(), user.getId())){
            throw new AppException(ErrorCode.USER_ALREADY_REVIEWED);
        }

        Review review = Review.builder()
                .rating(request.rating())
                .content(request.content())
                .movie(movie)
                .user(user)
                .build();

        reviewRepository.save(review);

        updateMovieRating(movie);

        return reviewMapper.toReviewResponse(review);
    }

    public Page<ReviewResponse> getReviewsByMovie(Long movieId, Pageable pageable){
        if(!movieRepository.existsById(movieId)){
            throw new AppException(ErrorCode.MOVIE_NOT_FOUND);
        }
        Page<Review> reviews = reviewRepository.findByMovieIdAndDeletedAtIsNull(movieId, pageable);

        return reviews.map(reviewMapper::toReviewResponse);
    }

    @Transactional
    public ReviewResponse updateReview(Long reviewId,ReviewRequest request){
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        validateReviewOwnership(review);

        review.setContent(request.content());
        review.setRating(request.rating());
        reviewRepository.save(review);

        updateMovieRating(review.getMovie());

        return reviewMapper.toReviewResponse(review);
    }

    @Transactional
    public void deleteReviewById(Long id){
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        validateReviewOwnership(review);

        review.setDeletedAt(LocalDateTime.now());
        reviewRepository.save(review);

        updateMovieRating(review.getMovie());
    }

    private void validateReviewOwnership(Review review){
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        if(!review.getUser().getEmail().equals(currentEmail)){
            throw new AppException(ErrorCode.UNAUTHORIZED_ACTION);
        }
    }
    private void updateMovieRating(Movie movie){
        Double avgRating = reviewRepository.calculateAvgRating(movie.getId());
        Integer total = reviewRepository.countByMovieId(movie.getId());

        movie.setAverageRating(avgRating);
        movie.setTotalReviews(total);
        movieRepository.save(movie);
    }
}
