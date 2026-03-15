package com.tientoan21.WebMovie.controller;

import com.tientoan21.WebMovie.dto.request.ReviewMovieRequest;
import com.tientoan21.WebMovie.dto.request.ReviewRequest;
import com.tientoan21.WebMovie.dto.response.ApiResponse;
import com.tientoan21.WebMovie.dto.response.ReviewResponse;
import com.tientoan21.WebMovie.service.ReviewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }
    @PostMapping()
    public ApiResponse<ReviewResponse> createReview(@RequestBody ReviewMovieRequest request){
        ReviewResponse review = reviewService.createReview(request);
        return ApiResponse.<ReviewResponse>builder()
                .data(review)
                .build();
    }
    @GetMapping("/{id}")
    public ApiResponse<Page<ReviewResponse>> getMovieReviews(
            @PathVariable Long movieId,
            @PageableDefault(size = 10, sort = "createAt" , direction = Sort.Direction.DESC) Pageable pageable
            ){
        return ApiResponse.<Page<ReviewResponse>>builder()
                .data(reviewService.getReviewsByMovie(movieId, pageable))
                .build();
    }
    @PutMapping("/{id}")
    public ApiResponse<ReviewResponse> updateReview(@PathVariable Long id, @RequestBody ReviewRequest request){
        ReviewResponse review = reviewService.updateReview(id, request);
        return ApiResponse.<ReviewResponse>builder()
                .data(review)
                .build();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id){
        reviewService.deleteReviewById(id);
        return ResponseEntity.noContent().build();
    }
}
