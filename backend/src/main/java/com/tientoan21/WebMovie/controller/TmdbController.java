package com.tientoan21.WebMovie.controller;

import com.tientoan21.WebMovie.dto.response.MovieMetadataResponse;
import com.tientoan21.WebMovie.service.TmdbService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tmdb")
public class TmdbController {
    private final TmdbService tmdbService;

    public TmdbController(TmdbService tmdbService) {
        this.tmdbService = tmdbService;
    }

    @GetMapping("/search")
    public MovieMetadataResponse search(@RequestParam String name) {
        return tmdbService.getMetadata(name);
    }
}
