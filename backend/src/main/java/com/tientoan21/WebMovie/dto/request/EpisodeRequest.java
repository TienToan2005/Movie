package com.tientoan21.WebMovie.dto.request;

public record EpisodeRequest(
         Integer episodeNumber,
         String videoUrl,
         String serverName
) {
}
