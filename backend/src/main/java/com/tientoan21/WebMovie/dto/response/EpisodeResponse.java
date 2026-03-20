package com.tientoan21.WebMovie.dto.response;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class EpisodeResponse {
    private Long id;
    private Integer episodeNumber;
    private String videoUrl;
    private String serverName;
}
