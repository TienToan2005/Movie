package com.tientoan21.WebMovie.dto.response;

import com.tientoan21.WebMovie.dto.request.TmdbCastDto;
import com.tientoan21.WebMovie.dto.request.TmdbCrewDto;

import java.util.List;

public record TmdbCreditsResponse(
        List<TmdbCastDto> cast,
        List<TmdbCrewDto> crew
) {}
